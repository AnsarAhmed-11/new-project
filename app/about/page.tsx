"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import styles from "@/app/styles/components/AboutPage.module.css";

const principles = [
  [
    "01",
    "Built for the work",
    "Every detail is considered around the way professionals actually use their tools.",
  ],
  [
    "02",
    "Precision by default",
    "Reliable materials and careful engineering keep performance consistent.",
  ],
  [
    "03",
    "Made to stay useful",
    "Durable essentials that earn their place in every workshop and tool bag.",
  ],
];

export default function AboutPage() {
  const reduced = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid}>
          <motion.div className={styles.heroCopy} {...reveal()}>
            <p className={styles.eyebrow}>
              <span /> About Merciful Tools
            </p>
            <h1>
              Tools with a <em>purpose.</em>
            </h1>
            <p className={styles.lead}>
              Think Tools, Think Merciful presents a whole range of Workshop,
              Precision and Magnetic Tools of International Standard.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className={styles.primaryButton}>
                Explore products <ArrowUpRight size={17} />
              </Link>
              <a href="#story" className={styles.textLink}>
                Our story <MoveRight size={17} />
              </a>
            </div>
          </motion.div>
          <motion.div
            className={styles.heroVisual}
            initial={reduced ? false : { opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className={styles.visualRing} />
            <div className={styles.visualCard}>
              <Image
                src="/solid-center.jpg"
                alt="Merciful Tools precision tool detail"
                width={560}
                height={560}
                priority
              />
              <span>EST. 2024</span>
            </div>
            <motion.div
              className={styles.visualNote}
              animate={reduced ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {" "}
              <i /> Made for the everyday craft
            </motion.div>
          </motion.div>
        </div>
        <div className={styles.scrollHint}>
          <span /> Scroll to discover
        </div>
      </section>
      <motion.section id="story" className={styles.story} {...reveal()}>
        <p className={styles.sectionLabel}>The idea</p>
        <div className={styles.storyContent}>
          <h2>
            Good work starts with <span>the right feel.</span>
          </h2>
          <div>
            <p>
              Merciful Tools began with a simple belief: a tool should disappear
              into the work. It should feel balanced in the hand, respond
              exactly when you need it, and keep showing up long after the
              packaging is gone.
            </p>
            <p>
              That belief guides every product we select and every detail we
              design. No clutter. No shortcuts. Just honest, capable tools made
              for getting the job done.
            </p>
          </div>
        </div>
      </motion.section>
      <section className={styles.principles}>
        <motion.div {...reveal()}>
          <p className={styles.eyebrow}>
            <span /> What we stand for
          </p>
          <h2>Useful by design.</h2>
        </motion.div>
        <div>
          {principles.map(([number, title, text], index) => (
            <motion.article
              key={number}
              className={styles.principle}
              {...reveal(index * 0.08)}
            >
              <b>{number}</b>
              <h3>{title}</h3>
              <p>{text}</p>
              <Check size={19} />
            </motion.article>
          ))}
        </div>
      </section>
      <motion.section className={styles.ctaSection} {...reveal()}>
        <div>
          <p className={styles.eyebrow}>
            <span /> Start with something solid
          </p>
          <h2>Ready for tools that keep up?</h2>
        </div>
        <Link href="/products" className={styles.primaryButton}>
          View the collection <ArrowUpRight size={17} />
        </Link>
      </motion.section>
      <Footer />
    </main>
  );
}
