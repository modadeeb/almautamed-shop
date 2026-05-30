/** ثوابت الهوية والروابط للمتجر. */
export const site = {
  name: "متجر المعتمد",
  tagline: "أدوية ومستلزمات طبية — تجزئة وجملة",
  description:
    "متجر المعتمد للأدوية: تشكيلة واسعة من الأدوية والمستلزمات الطبية والفيتامينات مع توصيل في عموم اليمن، وخدمات خاصة لعملاء الجملة والصيدليات.",
} as const;

/** روابط التنقّل الرئيسية في الترويسة والقائمة الجانبية. */
export const mainNav: { title: string; href: string }[] = [
  { title: "الرئيسية", href: "/" },
  { title: "الأدوية", href: "/category/medicines" },
  { title: "الفيتامينات", href: "/category/vitamins" },
  { title: "الأم والطفل", href: "/category/mother-child" },
  { title: "العناية بالبشرة", href: "/category/skincare" },
  { title: "الأجهزة الطبية", href: "/category/medical-devices" },
];

/** روابط لوحة الحساب. */
export const accountNav: { title: string; href: string }[] = [
  { title: "ملفي", href: "/account" },
  { title: "عناويني", href: "/account/addresses" },
  { title: "طلباتي", href: "/account/orders" },
  { title: "ترقية إلى جملة", href: "/account/wholesale-upgrade" },
  { title: "حالة الائتمان", href: "/account/credit-status" },
];
