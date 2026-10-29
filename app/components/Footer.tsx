import styles from "@/app/styles/components/Footer.module.css";

export default function Footer() {
  return <footer id="contact" className={styles.footer}>
    <div className={styles.container}>
      <div>
        <h2>MERCIFUL<span>TOOLS</span></h2>
        <p className={styles.description}>Precision tools engineered for accuracy, durability and professional performance.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <div className={styles.links}><a href="#home">Home</a><a href="#products">Products</a><a href="#about">About</a><a href="#contact">Contact</a></div>
      </div>
      <div id="about">
        <h3>Contact Us</h3>
        <div className={styles.contact}><p>📍 Delhi, India</p><p>📞 +91 XXXXX XXXXX</p><p>✉️ info@mercifultools.com</p></div>
      </div>
    </div>
    <div className={styles.bottom}>© 2026 Merciful Tools. All Rights Reserved.</div>
  </footer>;
}
