import { PagePlaceholder } from "@/components/page-placeholder";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title="صفحة الفئة"
      description={`عرض منتجات الفئة (${slug}) — قيد الإنشاء.`}
    />
  );
}
