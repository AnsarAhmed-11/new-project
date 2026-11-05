import { redirect } from "next/navigation";
import { getAdmin } from "@/app/lib/auth";
import ProductManager from "@/app/components/admin/ProductManager";

export default async function ProductsAdminPage() {
  if (!(await getAdmin())) redirect("/admin/login");
  return <ProductManager />;
}
