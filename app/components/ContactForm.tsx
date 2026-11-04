"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "@/app/styles/components/ContactForm.module.css";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus(null); setError(false);
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/auth/enquire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send your message.");
      setStatus("Thanks — your message has been sent. We’ll be in touch soon."); form.reset();
    } catch (submitError) { setError(true); setStatus(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return <section id="contact" className={styles.section}>
    <div className={styles.glow} />
    <div className={styles.container}>
      <motion.div className={styles.copy} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .65 }}>
        <p className={styles.eyebrow}><span /> Get in touch</p><h2>Let&apos;s find the right tool for <em>your work.</em></h2>
        <p className={styles.description}>Tell us what you&apos;re working on and our team will help you find a dependable solution.</p>
        <div className={styles.details}><p><Mail size={17} /> info@mercifultools.com</p><p><MapPin size={17} /> Delhi, India</p></div>
      </motion.div>
      <motion.form className={styles.form} onSubmit={handleSubmit} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay: .1 }}>
        <div className={styles.fields}><label>Full name<input name="name" required placeholder="Your name" /></label><label>Email address<input name="email" type="email" required placeholder="you@company.com" /></label><label>Phone number<input name="phone" required placeholder="+91 XXXXX XXXXX" /></label><label>Company<input name="company" placeholder="Company name" /></label></div>
        <label>What can we help with?<select name="product" defaultValue="" required><option value="" disabled>Select an option</option><option>Precision Tools</option><option>Industrial Tools</option><option>Custom Requirements</option><option>Other</option></select></label>
        <label>Your message<textarea name="message" rows={4} required placeholder="Tell us about your requirements..." /></label>
        <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send message"}<ArrowUpRight size={17} /></button>
        {status && <p className={`${styles.status} ${error ? styles.error : styles.success}`} role="status">{status}</p>}
      </motion.form>
    </div>
  </section>;
}
