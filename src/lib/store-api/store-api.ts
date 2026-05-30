/**
 * واجهة الـ Store API (Contract-first).
 *
 * كل صفحات المتجر تستهلك هذه الواجهة فقط. في المرحلة 1 تُنفَّذ عبر mockStoreApi،
 * ولاحقاً تُستبدَل بـ httpStoreApi (يتصل بـ Laravel/Sanctum) بنفس التواقيع تماماً.
 */
import type {
  Address,
  Banner,
  Cart,
  Category,
  CreditStatus,
  Order,
  Paginated,
  Product,
  ProductFilters,
  StoreAccount,
  StoreBank,
  WholesaleUpgradeRequest,
} from "./types";

// ————————————————————————————————————————————————————————————————
// حمولات الإدخال (Payloads)
// ————————————————————————————————————————————————————————————————

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  account: StoreAccount;
  token: string;
}

export interface AddItemPayload {
  productId: string;
  quantity: number;
}

export interface UpdateItemPayload {
  itemId: string;
  quantity: number;
}

export interface CheckoutPayload {
  addressId: string;
  /** خاص بعملاء الجملة فقط. */
  invoiceType?: Order["invoiceType"];
  couponCode?: string;
  notes?: string;
}

export interface UploadPaymentProofPayload {
  orderId: string;
  bankId: string;
  /** اسم/مرجع الملف المرفوع (في mock يكفي اسم وهمي). */
  reference: string;
  amount: number;
  note?: string;
}

export type UpdateProfilePayload = Partial<
  Pick<StoreAccount, "name" | "phone" | "whatsapp">
>;

export type AddressInput = Omit<Address, "id">;

export interface SubmitUpgradePayload {
  companyName: string;
  taxNumber?: string;
  commercialRegisterNumber?: string;
}

// ————————————————————————————————————————————————————————————————
// الواجهة الموحّدة
// ————————————————————————————————————————————————————————————————

export interface StoreApi {
  /** الكتالوج: البانرات، الفئات، المنتجات، البحث. */
  catalog: {
    getBanners(audience?: StoreAccount["accountType"]): Promise<Banner[]>;
    getCategories(): Promise<Category[]>;
    getProducts(filters?: ProductFilters): Promise<Paginated<Product>>;
    getProduct(slug: string): Promise<Product | null>;
    search(query: string): Promise<Product[]>;
  };

  /** المصادقة وإدارة الجلسة. */
  auth: {
    register(payload: RegisterPayload): Promise<AuthSession>;
    login(payload: LoginPayload): Promise<AuthSession>;
    logout(): Promise<void>;
    me(): Promise<StoreAccount | null>;
    forgotPassword(email: string): Promise<{ sent: boolean }>;
  };

  /** السلة. */
  cart: {
    getCart(): Promise<Cart>;
    addItem(payload: AddItemPayload): Promise<Cart>;
    updateItem(payload: UpdateItemPayload): Promise<Cart>;
    removeItem(itemId: string): Promise<Cart>;
    applyCoupon(code: string): Promise<Cart>;
  };

  /** الدفع والطلبات. */
  checkout: {
    checkout(payload: CheckoutPayload): Promise<Order>;
    uploadPaymentProof(payload: UploadPaymentProofPayload): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getOrder(id: string): Promise<Order | null>;
    confirmReceipt(orderId: string): Promise<Order>;
    cancelOrder(orderId: string): Promise<Order>;
  };

  /** الحساب والعناوين. */
  account: {
    getProfile(): Promise<StoreAccount>;
    updateProfile(payload: UpdateProfilePayload): Promise<StoreAccount>;
    getAddresses(): Promise<Address[]>;
    addAddress(input: AddressInput): Promise<Address>;
    updateAddress(id: string, input: AddressInput): Promise<Address>;
    deleteAddress(id: string): Promise<void>;
  };

  /** الجملة: طلب الترقية، حالة الائتمان، بنوك التحويل. */
  wholesale: {
    submitUpgradeRequest(
      payload: SubmitUpgradePayload,
    ): Promise<WholesaleUpgradeRequest>;
    getUpgradeRequest(): Promise<WholesaleUpgradeRequest | null>;
    getCreditStatus(): Promise<CreditStatus>;
    getStoreBanks(): Promise<StoreBank[]>;
  };
}
