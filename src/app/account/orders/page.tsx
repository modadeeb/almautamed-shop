import { PagePlaceholder } from "@/components/page-placeholder";

export default function OrdersPage() {
  return (
    <PagePlaceholder
      title="طلباتي"
      description="سجلّ الطلبات وحالاتها — قيد الإنشاء."
      backHref="/account"
      backLabel="العودة للحساب"
    />
  );
}
