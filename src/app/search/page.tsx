import { PagePlaceholder } from "@/components/page-placeholder";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <PagePlaceholder
      title="نتائج البحث"
      description={q ? `البحث عن: «${q}» — قيد الإنشاء.` : "صفحة البحث — قيد الإنشاء."}
    />
  );
}
