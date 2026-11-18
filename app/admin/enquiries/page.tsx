import { redirect } from "next/navigation";
import { getAdmin } from "@/app/lib/auth";
import AdminDashboard from "@/app/components/admin/AdminDashboard";
export default async function EnquiriesPage() {
    if (!(await getAdmin()))
        redirect("/admin/login");
    return <AdminDashboard />;
}
