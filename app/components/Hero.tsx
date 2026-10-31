import styles from "@/app/styles/components/Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Precision tools for a stronger tomorrow</p>
        <h2>PRECISION <br /> <span>IN EVERY</span> DETAIL <span>.</span></h2>
        <p className={styles.description}>Built strong. Built to last.</p>
        <a href="#products" className={styles.cta}>Explore products <span aria-hidden="true">→</span></a>
        <Link href={"/enquire"} className={styles.btntouch}>Get in Touch</Link>
      </div>
    </section>
  );
}
