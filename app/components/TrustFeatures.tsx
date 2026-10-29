import { Gem, Settings, ShieldCheck } from "lucide-react";
import styles from "@/app/styles/components/TrustFeatures.module.css";

const features = [
  { icon: Gem, title: "PREMIUM", subtitle: "QUALITY" },
  { icon: Settings, title: "PRECISION", subtitle: "ENGINEERING" },
  { icon: ShieldCheck, title: "BUILT", subtitle: "TO LAST" },
];

export default function TrustFeatures() {
  return <section className={styles.section}><div className={styles.grid}>
    {features.map(({ icon: Icon, title, subtitle }) => <div key={title} className={styles.feature}>
      <Icon size={32} strokeWidth={1.5} className={styles.icon} />
      <div><p>{title}</p><p className={styles.subtitle}>{subtitle}</p></div>
    </div>)}
  </div></section>;
}
