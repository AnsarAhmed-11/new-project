import { redirect } from "next/navigation";
import { getAdmin } from "@/app/lib/auth";
export default async function SettingsPage() { if (!(await getAdmin())) redirect("/admin/login"); return <main className="min-h-screen bg-[#080a0b] p-8 text-white"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-3 text-gray-400">Admin account setup is managed securely through environment variables and the protected setup endpoint.</p></main>; }
