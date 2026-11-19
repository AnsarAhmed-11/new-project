import type { Metadata } from "next";
import { ArrowDown, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import ContactForm from "@/app/components/ContactForm";
import Footer from "@/app/components/Footer";
import styles from "@/app/styles/components/ContactPage.module.css";

export const metadata: Metadata = {
  title: "Contact | Merciful Tools",
  description:
    "Contact Merciful Tools for dependable workshop, precision, and magnetic tool solutions.",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email us",
    value: "info@mercifultools.com",
    href: "mailto:info@mercifultools.com",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Delhi, India",
  },
];

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero} aria-labelledby="contact-heading">
        <div className={styles.glow} />
        <div className={styles.grid} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span /> Contact Merciful Tools
          </p>
          <h1 id="contact-heading">
            Let&apos;s build something <em>reliable.</em>
          </h1>
          <p className={styles.lead}>
            Whether you&apos;re sourcing for a workshop or looking for the right
            precision tool, our team is ready to help.
          </p>

          <div className={styles.details}>
            {contactDetails.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <Icon size={19} aria-hidden="true" />
                  <span>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </span>
                </>
              );

              return href ? (
                <a key={label} href={href} className={styles.detail}>
                  {content}
                </a>
              ) : (
                <div key={label} className={styles.detail}>
                  {content}
                </div>
              );
            })}
          </div>

          <a href="#message-form" className={styles.scrollLink}>
            <span>Send a message</span>
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <div id="message-form">
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}
