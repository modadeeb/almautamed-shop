import { PagePlaceholder } from "@/components/page-placeholder";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="تفاصيل الطلب"
      description={`تفاصيل الطلب (${id}) وخطه الزمني — قيد الإنشاء.`}
      backHref="/account/orders"
      backLabel="العودة للطلبات"
    />
  );
}
