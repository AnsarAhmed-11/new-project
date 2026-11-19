'use client'
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, Search, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router=useRouter()
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080D18] px-6 py-16 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Logo */}
        <Link href="/" className="mb-16 inline-flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Wrench size={21} />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Merciful<span className="text-blue-500">Tools</span>
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="select-none text-[130px] font-black leading-none tracking-tighter text-white/[0.07] sm:text-[190px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:h-28 sm:w-28">
              <Search size={48} strokeWidth={1.5} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Page Not Found
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Oops! Lost in the tools?
          </h2>

          <p className="mx-auto max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            The page you're looking for doesn't exist, may have been moved, or
            is temporarily unavailable. Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 sm:w-auto"
          >
            <Home size={17} />
            Back to Home
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={() =>router.push("/")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Merciful Tools. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Making your digital experience simpler.
          </p>
        </div>
      </div>
    </main>
  );
}
