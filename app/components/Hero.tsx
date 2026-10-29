import styles from "@/app/styles/components/Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Precision tools. Professional results.</p>
        <h2>Built for the work that <span>matters.</span></h2>
        <p className={styles.description}>Reliable tools designed for accuracy, durability, and confidence on every job.</p>
        <a href="#products" className={styles.cta}>Explore products <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
