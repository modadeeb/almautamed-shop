import type { Money } from "@/lib/store-api/types";

/**
 * العملة الافتراضية تأتي من متغيّر البيئة، ولا يُكتب أي رمز عملة ثابتاً في الكود.
 * TODO: العملة تُحسم لاحقاً (تأتي من الإعدادات/الـ API حسب السوق ونوع العميل).
 */
export const DEFAULT_CURRENCY =
  process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "YER";

/** لغة العرض الافتراضية (عربي). */
const LOCALE = "ar";

/**
 * ينسّق مبلغاً ماليّاً وفق رمز العملة المُمرَّر.
 * نعتمد على Intl.NumberFormat لاستخراج رمز/اسم العملة تلقائياً — لا رموز ثابتة.
 *
 * @param amount   المبلغ الرقمي.
 * @param currencyCode رمز العملة بصيغة ISO 4217 (مثل YER, SAR, USD). يُقرأ من الإعدادات/الـ API.
 */
export function formatMoney(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY,
): string {
  try {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: currencyCode,
      // بعض العملات (مثل الريال اليمني) لا تستخدم كسوراً عمليّاً؛ نسمح حتى منزلتين.
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    // في حال رمز عملة غير معروف لدى Intl، نعرض الرقم متبوعاً بالرمز كما هو.
    const formattedNumber = new Intl.NumberFormat(LOCALE, {
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formattedNumber} ${currencyCode}`;
  }
}

/** نسخة مريحة لتنسيق كائن Money مباشرة. */
export function formatMoneyObject(money: Money): string {
  return formatMoney(money.amount, money.currency);
}

/** ينسّق تاريخاً (نص ISO أو Date) بالعربية. */
export function formatDate(
  input: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALE, options).format(date);
}

/** ينسّق تاريخاً ووقتاً بالعربية. */
export function formatDateTime(input: string | Date): string {
  return formatDate(input, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** ينسّق عدداً بالعربية (دون عملة). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}
