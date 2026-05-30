/**
 * أنواع عقد الـ Store API (Contract-first).
 *
 * هذه الأنواع تمثّل العقد بين الواجهة الأمامية ونظام الـ ERP (Laravel + Sanctum)
 * عبر REST API على ‎`/api/store`. في المرحلة 1 يُنفَّذ العقد عبر mock فقط، ثم
 * يُستبدَل لاحقاً بمحوّل HTTP حقيقي بنفس التواقيع دون تغيير الصفحات.
 *
 * ملاحظة مهمة: لا يحتوي نوع المنتج على أي حقل تكلفة (cost) أو حد أدنى/أقصى للسعر.
 * السعر النهائي للعرض فقط هو ما يُكشَف للواجهة.
 */

// ————————————————————————————————————————————————————————————————
// أساسيات
// ————————————————————————————————————————————————————————————————

/** مبلغ مالي مرتبط برمز عملة (ISO 4217). الرمز يُحسم من الإعدادات/الـ API. */
export interface Money {
  amount: number;
  currency: string;
}

// ————————————————————————————————————————————————————————————————
// الكتالوج
// ————————————————————————————————————————————————————————————————

/** فئة من شجرة الفئات (تدعم التداخل عبر parentId). */
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  sortOrder: number;
}

/** صورة منتج واحدة. */
export interface ProductImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

/**
 * منتج (دواء أو مستلزم طبي).
 * لا يحتوي على أي حقل تكلفة أو حد سعر أدنى/أقصى — السعر المعروض فقط.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  scientificName?: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  images: ProductImage[];
  price: Money;
  inStock: boolean;
  availableQuantity?: number;
  barcode?: string;
}

/** بانر ترويجي يظهر في الصفحة الرئيسية أو صفحات الفئات. */
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: "home_top" | "home_grid" | "category";
  audience: "all" | "retail" | "wholesale";
}

// ————————————————————————————————————————————————————————————————
// الحساب والمستخدم
// ————————————————————————————————————————————————————————————————

/** نوع الحساب: تجزئة أو جملة. */
export type AccountType = "retail" | "wholesale";

/** حالة طلب الترقية إلى حساب جملة. */
export type WholesaleStatus = "none" | "pending" | "approved" | "rejected";

/** حساب العميل في المتجر. */
export interface StoreAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  accountType: AccountType;
  wholesaleStatus: WholesaleStatus;
}

/** عنوان شحن/استلام محفوظ لدى العميل. */
export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  building?: string;
  notes?: string;
  isDefault: boolean;
}

// ————————————————————————————————————————————————————————————————
// السلة
// ————————————————————————————————————————————————————————————————

/** عنصر داخل السلة. */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

/** سلة المشتريات. */
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: Money;
  discount: Money;
  total: Money;
  couponCode?: string;
}

// ————————————————————————————————————————————————————————————————
// الطلبات والفواتير
// ————————————————————————————————————————————————————————————————

/** نوع الفاتورة — خاص بعملاء الجملة فقط. */
export type InvoiceType = "cash" | "suspended_cash" | "credit";

/** حالة الطلب عبر دورة حياته. */
export type OrderStatus =
  | "pending_payment"
  | "awaiting_verification"
  | "verified"
  | "preparing"
  | "ready"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "rejected";

/** حدث ضمن الخط الزمني لحالة الطلب. */
export interface OrderStatusEvent {
  status: OrderStatus;
  note?: string;
  at: string;
}

/** طلب شراء. */
export interface Order {
  id: string;
  orderNumber: string;
  accountType: AccountType;
  invoiceType?: InvoiceType;
  status: OrderStatus;
  items: CartItem[];
  subtotal: Money;
  discount: Money;
  shippingFee: Money;
  total: Money;
  address: Address;
  createdAt: string;
  timeline: OrderStatusEvent[];
}

// ————————————————————————————————————————————————————————————————
// الجملة (بنوك التحويل، طلب الترقية، حالة الائتمان)
// ————————————————————————————————————————————————————————————————

/** بنك يستقبل تحويلات الدفع. */
export interface StoreBank {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  logoUrl?: string;
}

/** طلب ترقية حساب التجزئة إلى حساب جملة. */
export interface WholesaleUpgradeRequest {
  id: string;
  status: WholesaleStatus;
  companyName: string;
  taxNumber?: string;
  commercialRegisterNumber?: string;
  submittedAt: string;
  reviewNote?: string;
}

/** حالة الائتمان لعميل الجملة (للطلب على الحساب/الآجل). */
export interface CreditStatus {
  currentBalance: Money;
  openInvoicesAmount: Money;
  creditLimit: Money;
  maxOpenInvoices?: number;
  maxOpenAmount?: Money;
  canOrderOnCredit: boolean;
}

// ————————————————————————————————————————————————————————————————
// مدخلات/مرشّحات مساعدة لتواقيع الـ API
// ————————————————————————————————————————————————————————————————

/** مرشّحات قائمة المنتجات. */
export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  inStockOnly?: boolean;
  /** أدنى سعر (شامل) لتصفية النطاق السعري. */
  minPrice?: number;
  /** أقصى سعر (شامل) لتصفية النطاق السعري. */
  maxPrice?: number;
  /** شريحة مميّزة للعرض في الصفحة الرئيسية (وصل حديثاً / الأكثر مبيعاً). */
  featured?: "new_arrivals" | "best_sellers";
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
}

/** نتيجة مُقسّمة على صفحات. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
