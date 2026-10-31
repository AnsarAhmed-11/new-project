"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function submit(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError("");
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) setError(data.message || "Unable to sign in");
        else router.push("/admin/dashboard");
        setLoading(false)
    }
    return (
    <main className="flex min-h-screen items-center justify-center bg-[#080a0b] px-5">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101315] p-8 shadow-2xl">
            <div className="mb-8 flex items-center gap-3">
                <img src="/merciful-logo.png" alt="Merciful Tools" className="h-12 w-12 rounded-lg object-contain" />
                <div>
                    <h1 className="text-xl font-bold text-white">Admin Console</h1>
                    <p className="text-sm text-gray-500">Merciful Tools</p>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-400">Sign in to manage customer enquiries.</p>
            <form onSubmit={submit} className="mt-7 space-y-5">
                <label className="block text-sm text-gray-300">Email
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-lg border border-white/10 bg-[#171a1c] px-4 py-3 text-white outline-none focus:border-[#ff6a00]" />
                </label>
                <label className="block text-sm text-gray-300">Password
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-lg border border-white/10 bg-[#171a1c] px-4 py-3 text-white outline-none focus:border-[#ff6a00]" /></label>{error && <p className="text-sm text-red-400">{error}</p>}
                <button disabled={loading} className="w-full rounded-lg bg-[#ff6a00] py-3 font-bold text-white transition hover:bg-white hover:text-[#ff6a00] disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}
                </button>
            </form></div>
    </main>
    );
}
