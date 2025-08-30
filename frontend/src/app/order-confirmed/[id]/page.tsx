import { redirect } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  // Seamlessly reuse the existing success page
  redirect(`/orders/success/${params.id}`);
}