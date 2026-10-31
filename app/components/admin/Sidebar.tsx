"use client";
import Link from "next/link";
import { CheckCircle2, Clock3, FileText, LayoutDashboard, LogOut, Settings, Sparkles } from "lucide-react";
export default function Sidebar({ onLogout }: {
    onLogout: () => void
}) {
    return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#101315] p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"><div className="mb-6 flex items-center gap-3 px-2">
        <img src="/merciful-logo.png" alt="Merciful Tools" className="h-10 w-10 rounded-lg object-contain" />
        <div>
            <p className="font-bold text-white">Merciful Tools</p>
            <p className="text-xs text-[#ff6a00]">ADMIN CONSOLE</p>
        </div></div>
        <nav className="grid grid-cols-2 gap-1 lg:block lg:flex-1">
            {[["/admin/dashboard", LayoutDashboard, "Dashboard"],
            ["/admin/enquiries", FileText, "All Enquiries"],
            ["/admin/enquiries?status=new", Sparkles, "New Enquiries"],
            ["/admin/enquiries?status=in_progress", Clock3, "In Progress"],
            ["/admin/enquiries?status=completed", CheckCircle2, "Completed"],
            ["/admin/settings", Settings, "Settings"]].map(([href, Icon, label]) =>
                <Link href={href as string} key={label as string} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"><Icon size={17} /><span>{label as string}
                </span></Link>)}
        </nav>
        <button onClick={onLogout} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={17} />Logout</button>
    </aside>
    );
}
