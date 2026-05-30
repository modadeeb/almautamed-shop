/**
 * بيانات وهمية واقعية بالعربية لمتجر أدوية ومستلزمات طبية.
 * تُستخدم في المرحلة 1 فقط، وتُستبدَل لاحقاً ببيانات من نظام الـ ERP الحقيقي.
 */
import type {
  Address,
  Banner,
  Cart,
  Category,
  CreditStatus,
  Order,
  Product,
  StoreAccount,
  StoreBank,
  WholesaleUpgradeRequest,
} from "../types";

const CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "YER";

/** مولّد صورة placeholder بلون هادئ متناسق مع الهوية. */
function img(label: string, bg = "e6f4f1", fg = "0f766e"): string {
  return `https://placehold.co/600x600/${bg}/${fg}/png?text=${encodeURIComponent(
    label,
  )}`;
}

// ————————————————————————————————————————————————————————————————
// الفئات (هرمية)
// ————————————————————————————————————————————————————————————————

export const categories: Category[] = [
  { id: "cat-meds", name: "الأدوية", slug: "medicines", sortOrder: 1, imageUrl: img("الأدوية") },
  { id: "cat-otc", name: "أدوية بدون وصفة", slug: "otc", parentId: "cat-meds", sortOrder: 1, imageUrl: img("بدون وصفة") },
  { id: "cat-rx", name: "أدوية بوصفة", slug: "prescription", parentId: "cat-meds", sortOrder: 2, imageUrl: img("بوصفة") },
  { id: "cat-vitamins", name: "الفيتامينات والمكمّلات", slug: "vitamins", sortOrder: 2, imageUrl: img("فيتامينات") },
  { id: "cat-mother-child", name: "الأم والطفل", slug: "mother-child", sortOrder: 3, imageUrl: img("الأم والطفل") },
  { id: "cat-skincare", name: "العناية بالبشرة", slug: "skincare", sortOrder: 4, imageUrl: img("العناية بالبشرة") },
  { id: "cat-devices", name: "الأجهزة والمستلزمات الطبية", slug: "medical-devices", sortOrder: 5, imageUrl: img("أجهزة طبية") },
  { id: "cat-personal", name: "العناية الشخصية", slug: "personal-care", sortOrder: 6, imageUrl: img("عناية شخصية") },
];

// ————————————————————————————————————————————————————————————————
// المنتجات (10+ منتجات واقعية)
// ————————————————————————————————————————————————————————————————

export const products: Product[] = [
  {
    id: "p-001",
    slug: "paracetamol-500",
    name: "باراسيتامول 500 ملغ — 20 قرص",
    scientificName: "Paracetamol",
    shortDescription: "مسكّن للألم وخافض للحرارة.",
    description:
      "أقراص باراسيتامول 500 ملغ لتسكين الآلام الخفيفة إلى المتوسطة وخفض الحرارة. يُؤخذ حسب إرشادات الطبيب أو الصيدلي.",
    categoryId: "cat-otc",
    images: [{ url: img("باراسيتامول"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 850, currency: CURRENCY },
    inStock: true,
    availableQuantity: 320,
    barcode: "6001234500011",
  },
  {
    id: "p-002",
    slug: "ibuprofen-400",
    name: "إيبوبروفين 400 ملغ — 30 قرص",
    scientificName: "Ibuprofen",
    shortDescription: "مضاد للالتهاب ومسكّن.",
    description:
      "أقراص إيبوبروفين 400 ملغ، مضاد للالتهابات غير الستيرويدية يُستخدم لتسكين الألم والالتهاب.",
    categoryId: "cat-otc",
    images: [{ url: img("إيبوبروفين"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 1200, currency: CURRENCY },
    inStock: true,
    availableQuantity: 210,
    barcode: "6001234500028",
  },
  {
    id: "p-003",
    slug: "amoxicillin-500",
    name: "أموكسيسيلين 500 ملغ — 21 كبسولة",
    scientificName: "Amoxicillin",
    shortDescription: "مضاد حيوي واسع الطيف (بوصفة).",
    description:
      "كبسولات أموكسيسيلين 500 ملغ، مضاد حيوي يُصرف بوصفة طبية لعلاج العدوى البكتيرية.",
    categoryId: "cat-rx",
    images: [{ url: img("أموكسيسيلين"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 2400, currency: CURRENCY },
    inStock: true,
    availableQuantity: 90,
    barcode: "6001234500035",
  },
  {
    id: "p-004",
    slug: "vitamin-c-1000",
    name: "فيتامين سي 1000 ملغ — 30 قرص فوّار",
    scientificName: "Ascorbic Acid",
    shortDescription: "يدعم المناعة.",
    description:
      "أقراص فوّارة بفيتامين سي 1000 ملغ لدعم جهاز المناعة، بنكهة البرتقال.",
    categoryId: "cat-vitamins",
    images: [{ url: img("فيتامين C") }].map((i) => ({ ...i, isPrimary: true, sortOrder: 1 })),
    price: { amount: 1800, currency: CURRENCY },
    inStock: true,
    availableQuantity: 150,
    barcode: "6001234500042",
  },
  {
    id: "p-005",
    slug: "vitamin-d3-5000",
    name: "فيتامين د3 5000 وحدة — 60 كبسولة",
    scientificName: "Cholecalciferol",
    shortDescription: "لصحة العظام.",
    description:
      "كبسولات فيتامين د3 بجرعة 5000 وحدة دولية لدعم صحة العظام وامتصاص الكالسيوم.",
    categoryId: "cat-vitamins",
    images: [{ url: img("فيتامين D3"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 3200, currency: CURRENCY },
    inStock: false,
    availableQuantity: 0,
    barcode: "6001234500059",
  },
  {
    id: "p-006",
    slug: "baby-diapers-m",
    name: "حفاضات أطفال مقاس M — 40 قطعة",
    shortDescription: "نعومة وامتصاص عاليان.",
    description:
      "حفاضات أطفال عالية الامتصاص مقاس متوسط (M) مناسبة من 6 إلى 11 كجم.",
    categoryId: "cat-mother-child",
    images: [{ url: img("حفاضات") }].map((i) => ({ ...i, isPrimary: true, sortOrder: 1 })),
    price: { amount: 4500, currency: CURRENCY },
    inStock: true,
    availableQuantity: 60,
    barcode: "6001234500066",
  },
  {
    id: "p-007",
    slug: "baby-formula-stage1",
    name: "حليب أطفال مرحلة أولى — 400 جم",
    shortDescription: "تغذية متكاملة للرُّضّع.",
    description:
      "تركيبة حليب أطفال للمرحلة الأولى (0–6 أشهر) غنية بالعناصر الأساسية للنمو.",
    categoryId: "cat-mother-child",
    images: [{ url: img("حليب أطفال"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 5600, currency: CURRENCY },
    inStock: true,
    availableQuantity: 45,
    barcode: "6001234500073",
  },
  {
    id: "p-008",
    slug: "moisturizing-cream",
    name: "كريم مرطّب للبشرة الجافة — 200 مل",
    shortDescription: "ترطيب عميق يدوم طويلاً.",
    description:
      "كريم مرطّب غني للعناية بالبشرة الجافة والحساسة، خالٍ من العطور.",
    categoryId: "cat-skincare",
    images: [{ url: img("كريم مرطّب") }].map((i) => ({ ...i, isPrimary: true, sortOrder: 1 })),
    price: { amount: 2900, currency: CURRENCY },
    inStock: true,
    availableQuantity: 80,
    barcode: "6001234500080",
  },
  {
    id: "p-009",
    slug: "sunscreen-spf50",
    name: "واقٍ شمسي SPF 50 — 50 مل",
    shortDescription: "حماية عالية من الشمس.",
    description:
      "واقٍ شمسي بعامل حماية SPF 50، سريع الامتصاص ومناسب للوجه والجسم.",
    categoryId: "cat-skincare",
    images: [{ url: img("واقٍ شمسي"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 4100, currency: CURRENCY },
    inStock: true,
    availableQuantity: 70,
    barcode: "6001234500097",
  },
  {
    id: "p-010",
    slug: "digital-thermometer",
    name: "ميزان حرارة رقمي",
    shortDescription: "قراءة سريعة ودقيقة.",
    description:
      "ميزان حرارة رقمي بقراءة سريعة وشاشة واضحة، مناسب للاستخدام العائلي.",
    categoryId: "cat-devices",
    images: [{ url: img("ميزان حرارة") }].map((i) => ({ ...i, isPrimary: true, sortOrder: 1 })),
    price: { amount: 3500, currency: CURRENCY },
    inStock: true,
    availableQuantity: 120,
    barcode: "6001234500103",
  },
  {
    id: "p-011",
    slug: "blood-pressure-monitor",
    name: "جهاز قياس ضغط الدم الرقمي",
    shortDescription: "مراقبة منزلية موثوقة.",
    description:
      "جهاز قياس ضغط الدم الرقمي للذراع العلوي بذاكرة قراءات وشاشة كبيرة.",
    categoryId: "cat-devices",
    images: [{ url: img("جهاز ضغط"), isPrimary: true, sortOrder: 1 }],
    price: { amount: 18500, currency: CURRENCY },
    inStock: true,
    availableQuantity: 25,
    barcode: "6001234500110",
  },
  {
    id: "p-012",
    slug: "hand-sanitizer-500",
    name: "معقّم يدين 70% — 500 مل",
    shortDescription: "تعقيم فوري بدون ماء.",
    description:
      "جل معقّم لليدين بتركيز كحول 70% يقتل الجراثيم دون الحاجة للماء.",
    categoryId: "cat-personal",
    images: [{ url: img("معقّم يدين") }].map((i) => ({ ...i, isPrimary: true, sortOrder: 1 })),
    price: { amount: 1500, currency: CURRENCY },
    inStock: true,
    availableQuantity: 300,
    barcode: "6001234500127",
  },
];

/** شرائح مميّزة للصفحة الرئيسية (تُحاكي حقولاً يوفّرها الـ ERP لاحقاً). */
export const newArrivalSlugs: string[] = [
  "blood-pressure-monitor",
  "sunscreen-spf50",
  "vitamin-d3-5000",
  "moisturizing-cream",
  "baby-formula-stage1",
  "hand-sanitizer-500",
];

export const bestSellerSlugs: string[] = [
  "paracetamol-500",
  "vitamin-c-1000",
  "baby-diapers-m",
  "digital-thermometer",
  "ibuprofen-400",
  "amoxicillin-500",
];

// ————————————————————————————————————————————————————————————————
// البانرات
// ————————————————————————————————————————————————————————————————

export const banners: Banner[] = [
  {
    id: "b-001",
    title: "صحتك تبدأ من هنا — توصيل لكل اليمن",
    imageUrl: "https://placehold.co/1600x500/0f766e/ffffff/png?text=%D8%B5%D8%AD%D8%AA%D9%83+%D8%A3%D9%88%D9%84%D8%A7%D9%8B",
    linkUrl: "/category/vitamins",
    position: "home_top",
    audience: "all",
  },
  {
    id: "b-002",
    title: "عروض الجملة للصيدليات",
    imageUrl: "https://placehold.co/1600x500/115e59/ffffff/png?text=%D8%B9%D8%B1%D9%88%D8%B6+%D8%A7%D9%84%D8%AC%D9%85%D9%84%D8%A9",
    linkUrl: "/account/wholesale-upgrade",
    position: "home_top",
    audience: "wholesale",
  },
  {
    id: "b-003",
    title: "العناية بالأم والطفل",
    imageUrl: img("الأم والطفل", "fef3f2", "be123c"),
    linkUrl: "/category/mother-child",
    position: "home_grid",
    audience: "all",
  },
  {
    id: "b-004",
    title: "الفيتامينات والمكمّلات",
    imageUrl: img("فيتامينات", "ecfdf5", "047857"),
    linkUrl: "/category/vitamins",
    position: "home_grid",
    audience: "all",
  },
  {
    id: "b-005",
    title: "أجهزة طبية منزلية",
    imageUrl: img("أجهزة طبية", "eff6ff", "1d4ed8"),
    linkUrl: "/category/medical-devices",
    position: "home_grid",
    audience: "all",
  },
];

// ————————————————————————————————————————————————————————————————
// الحسابات (عميل تجزئة وعميل جملة)
// ————————————————————————————————————————————————————————————————

export const retailAccount: StoreAccount = {
  id: "acc-retail",
  name: "سالم عبدالله",
  email: "salem@example.com",
  phone: "+967770000001",
  whatsapp: "+967770000001",
  accountType: "retail",
  wholesaleStatus: "none",
};

export const wholesaleAccount: StoreAccount = {
  id: "acc-wholesale",
  name: "صيدلية النور",
  email: "alnoor@example.com",
  phone: "+967770000002",
  whatsapp: "+967770000002",
  accountType: "wholesale",
  wholesaleStatus: "approved",
};

/** الحساب الفعّال في الـ mock (نستخدم عميل التجزئة افتراضياً). */
export const currentAccount: StoreAccount = retailAccount;

// ————————————————————————————————————————————————————————————————
// العناوين
// ————————————————————————————————————————————————————————————————

export const addresses: Address[] = [
  {
    id: "addr-001",
    label: "المنزل",
    recipientName: "سالم عبدالله",
    phone: "+967770000001",
    city: "صنعاء",
    district: "حدّة",
    street: "شارع الستين",
    building: "عمارة 12",
    notes: "بجوار صيدلية الحياة",
    isDefault: true,
  },
  {
    id: "addr-002",
    label: "العمل",
    recipientName: "سالم عبدالله",
    phone: "+967770000003",
    city: "صنعاء",
    district: "التحرير",
    street: "شارع جمال",
    isDefault: false,
  },
];

// ————————————————————————————————————————————————————————————————
// السلة
// ————————————————————————————————————————————————————————————————

function money(amount: number) {
  return { amount, currency: CURRENCY };
}

export const initialCart: Cart = {
  id: "cart-001",
  items: [
    {
      id: "ci-001",
      product: products[0],
      quantity: 2,
      unitPrice: money(products[0].price.amount),
      lineTotal: money(products[0].price.amount * 2),
    },
    {
      id: "ci-002",
      product: products[3],
      quantity: 1,
      unitPrice: money(products[3].price.amount),
      lineTotal: money(products[3].price.amount),
    },
    {
      id: "ci-003",
      product: products[11],
      quantity: 3,
      unitPrice: money(products[11].price.amount),
      lineTotal: money(products[11].price.amount * 3),
    },
  ],
  subtotal: money(0),
  discount: money(0),
  total: money(0),
};

// ————————————————————————————————————————————————————————————————
// الطلبات (حالات مختلفة)
// ————————————————————————————————————————————————————————————————

export const orders: Order[] = [
  {
    id: "ord-001",
    orderNumber: "ORD-2026-0001",
    accountType: "retail",
    status: "awaiting_verification",
    items: [
      {
        id: "oi-1",
        product: products[1],
        quantity: 2,
        unitPrice: money(products[1].price.amount),
        lineTotal: money(products[1].price.amount * 2),
      },
    ],
    subtotal: money(2400),
    discount: money(0),
    shippingFee: money(500),
    total: money(2900),
    address: addresses[0],
    createdAt: "2026-05-20T10:30:00.000Z",
    timeline: [
      { status: "pending_payment", at: "2026-05-20T10:30:00.000Z" },
      { status: "awaiting_verification", note: "تم رفع إثبات التحويل", at: "2026-05-20T11:00:00.000Z" },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "ORD-2026-0002",
    accountType: "retail",
    status: "shipped",
    items: [
      {
        id: "oi-2",
        product: products[5],
        quantity: 1,
        unitPrice: money(products[5].price.amount),
        lineTotal: money(products[5].price.amount),
      },
      {
        id: "oi-3",
        product: products[6],
        quantity: 1,
        unitPrice: money(products[6].price.amount),
        lineTotal: money(products[6].price.amount),
      },
    ],
    subtotal: money(10100),
    discount: money(600),
    shippingFee: money(500),
    total: money(10000),
    address: addresses[0],
    createdAt: "2026-05-15T08:00:00.000Z",
    timeline: [
      { status: "pending_payment", at: "2026-05-15T08:00:00.000Z" },
      { status: "awaiting_verification", at: "2026-05-15T08:20:00.000Z" },
      { status: "verified", note: "تم تأكيد الدفع", at: "2026-05-15T09:00:00.000Z" },
      { status: "preparing", at: "2026-05-15T10:00:00.000Z" },
      { status: "ready", at: "2026-05-16T09:00:00.000Z" },
      { status: "shipped", note: "خرج مع المندوب", at: "2026-05-16T12:00:00.000Z" },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "ORD-2026-0003",
    accountType: "wholesale",
    invoiceType: "credit",
    status: "completed",
    items: [
      {
        id: "oi-4",
        product: products[0],
        quantity: 50,
        unitPrice: money(products[0].price.amount),
        lineTotal: money(products[0].price.amount * 50),
      },
      {
        id: "oi-5",
        product: products[11],
        quantity: 30,
        unitPrice: money(products[11].price.amount),
        lineTotal: money(products[11].price.amount * 30),
      },
    ],
    subtotal: money(87500),
    discount: money(7500),
    shippingFee: money(0),
    total: money(80000),
    address: addresses[1],
    createdAt: "2026-04-28T07:00:00.000Z",
    timeline: [
      { status: "verified", note: "فاتورة آجلة على الحساب", at: "2026-04-28T07:00:00.000Z" },
      { status: "preparing", at: "2026-04-28T09:00:00.000Z" },
      { status: "shipped", at: "2026-04-29T08:00:00.000Z" },
      { status: "delivered", at: "2026-04-30T11:00:00.000Z" },
      { status: "completed", note: "تم استلام الطلب", at: "2026-05-01T10:00:00.000Z" },
    ],
  },
  {
    id: "ord-004",
    orderNumber: "ORD-2026-0004",
    accountType: "retail",
    status: "cancelled",
    items: [
      {
        id: "oi-6",
        product: products[8],
        quantity: 1,
        unitPrice: money(products[8].price.amount),
        lineTotal: money(products[8].price.amount),
      },
    ],
    subtotal: money(4100),
    discount: money(0),
    shippingFee: money(500),
    total: money(4600),
    address: addresses[0],
    createdAt: "2026-05-10T14:00:00.000Z",
    timeline: [
      { status: "pending_payment", at: "2026-05-10T14:00:00.000Z" },
      { status: "cancelled", note: "أُلغي بطلب العميل", at: "2026-05-11T09:00:00.000Z" },
    ],
  },
];

// ————————————————————————————————————————————————————————————————
// بنوك التحويل
// ————————————————————————————————————————————————————————————————

export const storeBanks: StoreBank[] = [
  {
    id: "bank-001",
    name: "بنك التضامن الإسلامي",
    accountName: "شركة المعتمد للأدوية",
    accountNumber: "0123456789",
    iban: "YE00TADH0000000123456789",
    logoUrl: img("بنك", "f8fafc", "0f172a"),
  },
  {
    id: "bank-002",
    name: "بنك الكريمي",
    accountName: "شركة المعتمد للأدوية",
    accountNumber: "9876543210",
    iban: "YE00KRMI0000009876543210",
    logoUrl: img("بنك", "f8fafc", "0f172a"),
  },
  {
    id: "bank-003",
    name: "البنك الأهلي اليمني",
    accountName: "شركة المعتمد للأدوية",
    accountNumber: "5551234567",
    logoUrl: img("بنك", "f8fafc", "0f172a"),
  },
];

// ————————————————————————————————————————————————————————————————
// الجملة: طلب الترقية وحالة الائتمان
// ————————————————————————————————————————————————————————————————

export const upgradeRequest: WholesaleUpgradeRequest = {
  id: "wur-001",
  status: "approved",
  companyName: "صيدلية النور",
  taxNumber: "TX-558877",
  commercialRegisterNumber: "CR-112233",
  submittedAt: "2026-03-01T09:00:00.000Z",
  reviewNote: "تمت الموافقة على ترقية الحساب إلى جملة.",
};

export const creditStatus: CreditStatus = {
  currentBalance: money(120000),
  openInvoicesAmount: money(45000),
  creditLimit: money(500000),
  maxOpenInvoices: 10,
  maxOpenAmount: money(300000),
  canOrderOnCredit: true,
};
