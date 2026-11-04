"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "@/app/styles/components/Hero.module.css";

export default function Hero() {
  return <section id="home" className={styles.hero}>
    <div className={styles.glow} />
    <motion.div className={styles.content} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
      <p className={styles.eyebrow}>Precision tools for a stronger tomorrow</p>
      <h2>PRECISION <br /> <span>IN EVERY</span> DETAIL <span>.</span></h2>
      <p className={styles.description}>Built strong. Built to last.</p>
      <div className={styles.actions}>
        <a href="#products" className={styles.cta}>Explore products <span aria-hidden="true">→</span></a>
        <Link href="/enquire" className={styles.btntouch}>Get in Touch</Link>
      </div>
    </motion.div>
  </section>;
}
