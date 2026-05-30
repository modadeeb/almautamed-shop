import { PagePlaceholder } from "@/components/page-placeholder";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title="صفحة المنتج"
      description={`تفاصيل المنتج (${slug}) — قيد الإنشاء.`}
    />
  );
}
