"use client";

import { Gem, Settings, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import styles from "@/app/styles/components/TrustFeatures.module.css";

const features = [
  { icon: Gem, title: "PREMIUM", subtitle: "QUALITY" },
  { icon: Settings, title: "PRECISION", subtitle: "ENGINEERING" },
  { icon: ShieldCheck, title: "BUILT", subtitle: "TO LAST" },
];

export default function TrustFeatures() {
  return <section className={styles.section}><div className={styles.grid}>
    {features.map(({ icon: Icon, title, subtitle }, index) => <motion.div key={title} className={styles.feature} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .5, delay: index * .1 }}>
      <Icon size={32} strokeWidth={1.5} className={styles.icon} />
      <div><p>{title}</p><p className={styles.subtitle}>{subtitle}</p></div>
    </motion.div>)}
  </div></section>;
}
