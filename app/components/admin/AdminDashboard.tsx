"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, CheckCircle2, Clock3, Eye, FileText, Mail, Phone, Search, Trash2, UserRound, XCircle } from "lucide-react";
import Sidebar from "@/app/components/admin/Sidebar";
import StatsCard from "@/app/components/admin/StatsCard";
import type { Enquiry } from "@/app/models/enquiryModel";

const labels: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled"
};
const statusColor: Record<string, string> = {
    new: "bg-blue-500/15 text-blue-300",
    contacted: "bg-purple-500/15 text-purple-300",
    in_progress: "bg-yellow-500/15 text-yellow-300",
    completed: "bg-green-500/15 text-green-300",
    cancelled: "bg-red-500/15 text-red-300"
};
type Stats = {
    total: number;
    new: number;
    contacted: number;
    in_progress: number;
    completed: number;
    cancelled: number
};
export default function AdminDashboard() {
    const router = useRouter();
    const params = useSearchParams();
    const [stats, setStats] = useState<Stats>({ total: 0, new: 0, contacted: 0, in_progress: 0, completed: 0, cancelled: 0 });
    const [items, setItems] = useState<Enquiry[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(params.get("status") || "");
    const [date, setDate] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState<Enquiry | null>(null);
    const [notice, setNotice] = useState("");
    async function load() {
        setLoading(true); setError("");
        const query = new URLSearchParams(
            { page: String(page), limit: "10", sort })
            ; if (search) query.set("search", search);
        if (status) query.set("status", status);
        if (date) query.set("date", date);
        const [listRes, statsRes] = await Promise.all([fetch(`/api/enquiries?${query}`), fetch("/api/dashboard/stats")]);
        if (listRes.status === 401 || statsRes.status === 401) {
            router.push("/admin/login");
            return
        }
        const list = await listRes.json();
        const stat = await statsRes.json();
        if (!listRes.ok) { setError(list.message || "Unable to load enquiries"); }
        else {
            setItems(list.data);
            setTotalPages(list.totalPages || 1)
        }
        if (statsRes.ok) setStats(stat);
        setLoading(false)
    }
    // The timeout keeps the fetch state transition outside the effect's synchronous body.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const timer = window.setTimeout(() => {
            void load()
        }, 0);
        return () => window.clearTimeout(timer)
    },
        [page, status, date, sort, search]);
    async function changeStatus(id: number, next: string) {
        const res = await fetch(`/api/enquiries/${id}`,
            {
                method: "PATCH", headers:
                    { "Content-Type": "application/json" },
                body: JSON.stringify({ status: next })
            });
        if (res.ok) {
            setNotice("Status updated");
            setSelected(null); load()
        }
        else setError("Unable to update status")
    }
    async function remove(id: number) {
        if (!confirm("Delete this enquiry permanently?"))
            return;
        const res = await fetch(`/api/enquiries/${id}`,
            { method: "DELETE" });
        if (res.ok) {
            setNotice("Enquiry deleted");
            setSelected(null);
            load()
        } else setError("Unable to delete enquiry")
    }
    async function logout() {
        await fetch("/api/admin/logout",
            { method: "POST" });
        router.push("/admin/login")
    }
    function format(value: string) {
        return new Date(value).toLocaleDateString("en-IN",
            { day: "2-digit", month: "short", year: "numeric" })
    }
    return <div className="min-h-screen bg-[#080a0b] text-white lg:flex">
        <Sidebar onLogout={logout} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[3px] text-[#ff6a00]">Overview</p>
                    <h1 className="mt-2 text-3xl font-bold">Enquiry Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Monitor and manage customer conversations.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#101315] px-4 py-2 text-sm text-gray-400">Live database data</div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <StatsCard label="Total" value={stats.total} icon={BarChart3} accent />
                <StatsCard label="New" value={stats.new} icon={FileText} />
                <StatsCard label="Contacted" value={stats.contacted} icon={Mail} />
                <StatsCard label="In Progress" value={stats.in_progress} icon={Clock3} />
                <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2} />
                <StatsCard label="Cancelled" value={stats.cancelled} icon={XCircle} />
            </div>
            <section className="mt-8 rounded-xl border border-white/10 bg-[#101315]">
                <div className="flex flex-col gap-3 border-b border-white/10 p-4 xl:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-500" size={17} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search name, email or phone…" className="w-full rounded-lg border border-white/10 bg-[#171a1c] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#ff6a00]" />
                    </div>
                    <select value={status} onChange={e => {
                        setStatus(e.target.value); setPage(1)
                    }} className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-sm text-gray-300 outline-none">
                        <option value="">All statuses</option>{Object.entries(labels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select>
                    <input type="date" value={date} onChange={e => {
                        setDate(e.target.value);
                        setPage(1)
                    }} className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-sm text-gray-300 outline-none" />
                    <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-sm text-gray-300 outline-none">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
                {notice && <p className="border-b border-white/10 px-4 py-3 text-sm text-green-400">{notice}</p>}
                {error && <p className="border-b border-white/10 px-4 py-3 text-sm text-red-400">{error}</p>}
                <div className="overflow-x-auto">
                    {loading ? <p className="p-10 text-center text-gray-500">Loading enquiries…</p>
                        : items.length === 0 ?
                            <p className="p-10 text-center text-gray-500">No enquiries match your filters.</p>
                            : <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        {["ID", "Customer", "Company", "Email",
                                            "Phone", "Product", "Date", "Status", "Actions"].map(x =>
                                                <th key={x} className="px-4 py-4 font-medium">{x}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => <tr key={item.id} className="border-b border-white/5 transition hover:bg-white/[.025]">
                                        <td className="px-4 py-4 text-gray-500">#{item.id}
                                        </td>
                                        <td className="px-4 py-4 font-medium text-white">{item.name}</td>
                                        <td className="px-4 py-4 text-gray-400">{item.company || "—"}</td>
                                        <td className="px-4 py-4 text-gray-400">{item.email}</td>
                                        <td className="px-4 py-4 text-gray-400">{item.phone}</td>
                                        <td className="px-4 py-4 text-gray-300">{item.product}</td>
                                        <td className="whitespace-nowrap px-4 py-4 text-gray-400">{format(item.createdAt)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[item.status]}`}>
                                                {labels[item.status]}
                                            </span></td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button title="View details" onClick={() => setSelected(item)} className="rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                                                    <Eye size={16} />
                                                </button>
                                                <button title="Delete" onClick={() => remove(item.id)} className="rounded-md p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>)}
                                </tbody></table>}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-4 text-sm text-gray-500">
                    <span>Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-md border border-white/10 px-3 py-1.5 disabled:opacity-30">Previous
                        </button>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-md border border-white/10 px-3 py-1.5 disabled:opacity-30">Next</button>
                    </div>
                </div>
            </section>
        </main>{selected && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111416] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-[#ff6a00]">Enquiry #{selected.id}</p>
                        <h2 className="mt-1 text-2xl font-bold">{selected.name}</h2>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">
                        <XCircle />
                    </button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Email", selected.email, Mail], ["Phone", selected.phone, Phone], ["Company", selected.company || "—", UserRound], ["Product", selected.product, FileText]].map(([label, value, Icon]) =>
                    <div key={label as string} className="rounded-lg border border-white/10 bg-[#171a1c] p-3">
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                            <Icon size={14} />{label as string}
                        </p>
                        <p className="mt-1 text-sm text-gray-200">{value as string}</p>
                    </div>)}
                </div>
                <div className="mt-4 rounded-lg border border-white/10 bg-[#171a1c] p-4">\
                    <p className="text-xs text-gray-500">Customer message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">{selected.message}</p>
                </div><div className="mt-5 flex items-center justify-between gap-3">
                    <select value={selected.status} onChange={e => changeStatus(selected.id, e.target.value)} className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2 text-sm text-white">{Object.entries(labels).map(([key, value]) =>
                        <option key={key} value={key}>{value}</option>)}
                    </select>
                    <p className="text-xs text-gray-500">Submitted {format(selected.createdAt)}</p>
                </div>
            </div>
        </div>}
    </div>
}
