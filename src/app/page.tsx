import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  Truck,
  Construction,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mainNav, site } from "@/lib/site";

const features = [
  {
    icon: Truck,
    title: "توصيل لكل اليمن",
    description: "نوصّل طلباتك إلى عموم المحافظات بسرعة وأمان.",
  },
  {
    icon: ShieldCheck,
    title: "منتجات موثوقة",
    description: "أدوية ومستلزمات أصلية من مصادر معتمدة.",
  },
  {
    icon: Building2,
    title: "خدمات الجملة",
    description: "أسعار وخدمات خاصة للصيدليات وعملاء الجملة.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* قسم البطل (Hero) */}
      <section className="bg-hero-gradient">
        <div className="container flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <span className="rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            صحتك تبدأ من هنا
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            {site.name} — {site.tagline}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {site.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/category/medicines">
                تصفّح المنتجات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/account/wholesale-upgrade">انضم كعميل جملة</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* المزايا */}
      <section className="container py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* روابط الفئات السريعة */}
      <section className="container pb-12">
        <h2 className="mb-4 text-lg font-bold">تسوّق حسب الفئة</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {mainNav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft-lg"
            >
              <span className="text-sm font-medium group-hover:text-primary">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* إشعار المرحلة 1 */}
      <section className="container pb-16">
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:text-start">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background">
              <Construction className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">المرحلة 1: الأساس</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                البنية والتصميم وعقد الـ API جاهزة، والبيانات وهمية (mock).
                منطق الكتالوج والدفع والاتصال بنظام الـ ERP سيأتي في المراحل
                القادمة.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
