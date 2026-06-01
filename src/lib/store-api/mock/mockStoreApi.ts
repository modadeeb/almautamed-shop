/**
 * تنفيذ وهمي (mock) لواجهة StoreApi.
 *
 * يحاكي شبكةً حقيقية بتأخير صناعي بسيط، ويحتفظ بحالة قابلة للتعديل للسلة
 * والعناوين أثناء الجلسة. لاحقاً يُستبدَل بـ httpStoreApi بنفس الواجهة.
 */
import type { StoreApi } from "../store-api";
import type {
  Address,
  Cart,
  CartItem,
  Money,
  Order,
  Paginated,
  Product,
  StoreAccount,
} from "../types";
import {
  addresses as seedAddresses,
  banners,
  bestSellerSlugs,
  categories,
  creditStatus,
  currentAccount,
  initialCart,
  newArrivalSlugs,
  orders as seedOrders,
  products,
  storeBanks,
  upgradeRequest,
} from "./data";

const CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "YER";

/** تأخير صناعي لمحاكاة زمن الشبكة. */
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function money(amount: number): Money {
  return { amount, currency: CURRENCY };
}

// ————————————————————————————————————————————————————————————————
// حالة قابلة للتعديل أثناء الجلسة (نسخ عميقة من البذور)
// ————————————————————————————————————————————————————————————————

let account: StoreAccount = { ...currentAccount };
let addresses: Address[] = seedAddresses.map((a) => ({ ...a }));
let orders: Order[] = seedOrders.map((o) => ({ ...o }));

let cart: Cart = {
  ...initialCart,
  items: initialCart.items.map((i) => ({ ...i })),
};

/** يعيد حساب مجاميع السلة (مع تطبيق كوبون افتراضي للخصم). */
function recalcCart(target: Cart): Cart {
  const subtotal = target.items.reduce(
    (sum, item) => sum + item.lineTotal.amount,
    0,
  );
  const discount = target.couponCode === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  target.subtotal = money(subtotal);
  target.discount = money(discount);
  target.total = money(Math.max(0, subtotal - discount));
  return target;
}

recalcCart(cart);

let cartItemSeq = cart.items.length;

function findProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

// ————————————————————————————————————————————————————————————————
// التنفيذ
// ————————————————————————————————————————————————————————————————

export const mockStoreApi: StoreApi = {
  catalog: {
    async getBanners(audience) {
      const list = banners.filter(
        (b) => b.audience === "all" || !audience || b.audience === audience,
      );
      return delay(list);
    },

    async getCategories() {
      return delay([...categories].sort((a, b) => a.sortOrder - b.sortOrder));
    },

    async getProducts(filters = {}) {
      let list = [...products];

      if (filters.categorySlug) {
        const cat = categories.find((c) => c.slug === filters.categorySlug);
        if (cat) {
          // ندرج المنتجات من الفئة وأبنائها المباشرين.
          const childIds = categories
            .filter((c) => c.parentId === cat.id)
            .map((c) => c.id);
          const allowed = new Set([cat.id, ...childIds]);
          list = list.filter((p) => allowed.has(p.categoryId));
        }
      }

      if (filters.categoryId) {
        list = list.filter((p) => p.categoryId === filters.categoryId);
      }

      if (filters.search) {
        const q = filters.search.trim().toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.scientificName?.toLowerCase().includes(q) ||
            p.shortDescription?.toLowerCase().includes(q),
        );
      }

      if (filters.inStockOnly) {
        list = list.filter((p) => p.inStock);
      }

      if (typeof filters.minPrice === "number") {
        list = list.filter((p) => p.price.amount >= filters.minPrice!);
      }

      if (typeof filters.maxPrice === "number") {
        list = list.filter((p) => p.price.amount <= filters.maxPrice!);
      }

      if (filters.featured) {
        const order =
          filters.featured === "new_arrivals" ? newArrivalSlugs : bestSellerSlugs;
        const rank = new Map(order.map((slug, i) => [slug, i]));
        list = list
          .filter((p) => rank.has(p.slug))
          .sort((a, b) => rank.get(a.slug)! - rank.get(b.slug)!);
      }

      switch (filters.sort) {
        case "price_asc":
          list.sort((a, b) => a.price.amount - b.price.amount);
          break;
        case "price_desc":
          list.sort((a, b) => b.price.amount - a.price.amount);
          break;
        case "name":
          list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
          break;
        default:
          break;
      }

      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 12;
      const total = list.length;
      const start = (page - 1) * pageSize;
      const items = list.slice(start, start + pageSize);

      const result: Paginated<Product> = {
        items,
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
      return delay(result);
    },

    async getProduct(slug) {
      return delay(products.find((p) => p.slug === slug) ?? null);
    },

    async search(query) {
      const q = query.trim().toLowerCase();
      if (!q) return delay([]);
      const list = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.scientificName?.toLowerCase().includes(q),
      );
      return delay(list, 250);
    },
  },

  auth: {
    async register(payload) {
      account = {
        id: "acc-new",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        whatsapp: payload.whatsapp,
        accountType: "retail",
        wholesaleStatus: "none",
      };
      return delay({ account: { ...account }, token: "mock-token" });
    },

    async login(payload) {
      account = { ...currentAccount, email: payload.email };
      return delay({ account: { ...account }, token: "mock-token" });
    },

    async logout() {
      return delay(undefined);
    },

    async me() {
      return delay({ ...account });
    },

    async forgotPassword() {
      return delay({ sent: true });
    },
  },

  cart: {
    async getCart() {
      return delay(recalcCart(cart));
    },

    async addItem({ productId, quantity }) {
      const product = findProduct(productId);
      if (!product) return delay(recalcCart(cart));

      const existing = cart.items.find((i) => i.product.id === productId);
      if (existing) {
        existing.quantity += quantity;
        existing.lineTotal = money(existing.unitPrice.amount * existing.quantity);
      } else {
        cartItemSeq += 1;
        const item: CartItem = {
          id: `ci-${cartItemSeq}`,
          product,
          quantity,
          unitPrice: money(product.price.amount),
          lineTotal: money(product.price.amount * quantity),
        };
        cart.items.push(item);
      }
      return delay(recalcCart(cart));
    },

    async updateItem({ itemId, quantity }) {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        if (quantity <= 0) {
          cart.items = cart.items.filter((i) => i.id !== itemId);
        } else {
          item.quantity = quantity;
          item.lineTotal = money(item.unitPrice.amount * quantity);
        }
      }
      return delay(recalcCart(cart));
    },

    async removeItem(itemId) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
      return delay(recalcCart(cart));
    },

    async applyCoupon(code) {
      cart.couponCode = code.trim().toUpperCase();
      return delay(recalcCart(cart));
    },
  },

  checkout: {
    async checkout(payload) {
      const address =
        addresses.find((a) => a.id === payload.addressId) ?? addresses[0];
      const now = new Date().toISOString();
      const order: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `ORD-2026-${String(orders.length + 1).padStart(4, "0")}`,
        accountType: account.accountType,
        invoiceType: payload.invoiceType,
        status: "pending_payment",
        items: cart.items.map((i) => ({ ...i })),
        subtotal: { ...cart.subtotal },
        discount: { ...cart.discount },
        shippingFee: money(500),
        total: money(cart.total.amount + 500),
        address,
        createdAt: now,
        timeline: [{ status: "pending_payment", at: now }],
      };
      orders = [order, ...orders];

      // تُفرَّغ السلة بعد إنشاء الطلب.
      cart = { ...cart, items: [], couponCode: undefined };
      recalcCart(cart);

      return delay({ ...order });
    },

    async uploadPaymentProof({ orderId }) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = "awaiting_verification";
        order.timeline.push({
          status: "awaiting_verification",
          note: "تم رفع إثبات التحويل",
          at: new Date().toISOString(),
        });
      }
      return delay({ ...(order ?? orders[0]) });
    },

    async getOrders() {
      return delay(orders.map((o) => ({ ...o })));
    },

    async getOrder(id) {
      return delay(orders.find((o) => o.id === id) ?? null);
    },

    async confirmReceipt(orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = "completed";
        order.timeline.push({
          status: "completed",
          note: "تم استلام الطلب",
          at: new Date().toISOString(),
        });
      }
      return delay({ ...(order ?? orders[0]) });
    },

    async cancelOrder(orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = "cancelled";
        order.timeline.push({
          status: "cancelled",
          note: "أُلغي بطلب العميل",
          at: new Date().toISOString(),
        });
      }
      return delay({ ...(order ?? orders[0]) });
    },
  },

  account: {
    async getProfile() {
      return delay({ ...account });
    },

    async updateProfile(payload) {
      account = { ...account, ...payload };
      return delay({ ...account });
    },

    async getAddresses() {
      return delay(addresses.map((a) => ({ ...a })));
    },

    async addAddress(input) {
      const address: Address = { ...input, id: `addr-${Date.now()}` };
      if (address.isDefault) {
        addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      }
      addresses = [...addresses, address];
      return delay({ ...address });
    },

    async updateAddress(id, input) {
      let updated: Address | undefined;
      addresses = addresses.map((a) => {
        if (a.id === id) {
          updated = { ...input, id };
          return updated;
        }
        return input.isDefault ? { ...a, isDefault: false } : a;
      });
      return delay({ ...(updated ?? addresses[0]) });
    },

    async deleteAddress(id) {
      addresses = addresses.filter((a) => a.id !== id);
      return delay(undefined);
    },
  },

  wholesale: {
    async submitUpgradeRequest(payload) {
      return delay({
        id: `wur-${Date.now()}`,
        status: "pending",
        companyName: payload.companyName,
        taxNumber: payload.taxNumber,
        commercialRegisterNumber: payload.commercialRegisterNumber,
        submittedAt: new Date().toISOString(),
      });
    },

    async getUpgradeRequest() {
      return delay(
        account.accountType === "wholesale" ? { ...upgradeRequest } : null,
      );
    },

    async getCreditStatus() {
      return delay({ ...creditStatus });
    },

    async getStoreBanks() {
      return delay(storeBanks.map((b) => ({ ...b })));
    },
  },
};
