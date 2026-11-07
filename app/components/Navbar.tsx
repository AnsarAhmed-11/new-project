"use client";

import { ArrowUpRight, Menu, MoveRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import styles from "@/app/styles/components/Navbar.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [authMessage, setAuthMessage] = useState("");
  const pathname = usePathname();
  // const showAuthForm = (mode: "signin" | "signup") => {
  //   setOpen(false);
  //   setAuthMode(mode);
  //   setAuthStatus("idle");
  //   setAuthMessage("");
  // };
  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthStatus("loading");
    setAuthMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Authentication failed.");
      }

      form.reset();
      setAuthStatus("success");
      setAuthMessage(result.message);
      event.currentTarget.reset();
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <div className={styles.container}>
          <a
            href="#home"
            aria-label="Merciful Tools home"
            className={styles.brand}
          >
            <Image
              className={styles.logo}
              src="/merciful-logo.png"
              alt="Merciful Tools"
              width={360}
              height={117}
              priority
            />
            {/* <div className={styles.brandText}>
              <h1>MERCIFUL</h1>
              <p>TOOLS</p>
            </div> */}
          </a>

          <nav aria-label="Primary navigation" className={styles.desktopNav}>
            <Link
              href="/"
              className={isActive("/") ? styles.active : ""}
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
              <span />
            </Link>

            <Link
              href="/products"
              className={isActive("/products") ? styles.active : ""}
              aria-current={isActive("/products") ? "page" : undefined}
            >
              Products
            </Link>

            <Link
              href="/about"
              className={isActive("/about") ? styles.active : ""}
              aria-current={isActive("/about") ? "page" : undefined}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={isActive("/contact") ? styles.active : ""}
              aria-current={isActive("/contact") ? "page" : undefined}
            >
              Contact
            </Link>
          </nav>

          <div className={styles.actions}>
            {/* <button type="button" className={styles.authButton} onClick={() => showAuthForm("signin")}>Sign in</button> */}
            {/* <button type="button" className={styles.authButton} onClick={() => showAuthForm("signup")}>Sign up</button> */}
            <Link href="/enquire" className={styles.cta}>
              Enquire Now
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label="Search"
              className={styles.iconButton}
            >
              <Search size={26} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={28} aria-hidden="true" />
            ) : (
              <Menu size={28} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className={styles.mobilePanel}>
          <nav aria-label="Mobile navigation" className={styles.mobileNav}>
            <Link
              href="/"
              className={isActive("/") ? styles.mobileActive : ""}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={isActive("/products") ? styles.mobileActive : ""}
              onClick={() => setOpen(false)}
            >
              Products
            </Link>

            <Link
              href="/about"
              className={isActive("/about") ? styles.mobileActive : ""}
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={isActive("/contact") ? styles.mobileActive : ""}
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>

            {/* Keep your existing mobile CTA here */}
          </nav>
        </div>
      )}

      {/* {authMode && (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setAuthMode(null)}>
          <section
            className={styles.authModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} aria-label="Close authentication form" onClick={() => setAuthMode(null)}>
              <X size={22} aria-hidden="true" />
            </button>
            <p className={styles.authEyebrow}>Merciful Tools</p>
            <h2 id="auth-title">{authMode === "signin" ? "Welcome back" : "Create your account"}</h2>
            <p className={styles.authDescription}>
              {authMode === "signin" ? "Sign in to continue to your account." : "Sign up to keep track of your tools and enquiries."}
            </p>
            <form className={styles.authForm} onSubmit={submitAuth}>
              {authMode === "signup" && (
                <label>
                  Full name
                  <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
                </label>
              )}
              <label>
                Email address
                <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" autoComplete={authMode === "signin" ? "current-password" : "new-password"} placeholder="Enter your password" minLength={8} required />
              </label>
              <button type="submit" className={styles.authSubmit} disabled={authStatus === "loading"}>
                {authStatus === "loading" ? "Please wait..." : authMode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
            {authMessage && <p className={`${styles.authMessage} ${styles[authStatus]}`} role="status">{authMessage}</p>}
            <p className={styles.authSwitch}>
              {authMode === "signin" ? "New to Merciful Tools?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}>
                {authMode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </section>
        </div>
      )} */}
    </header>
  );
}
