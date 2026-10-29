import { CircleDot, icons, Ruler, SquareStack, Wrench } from "lucide-react";
import styles from "@/app/styles/components/CategoryBar.module.css";
import Image from "next/image";

const categories = [
  { icon: CircleDot, title: "Turning Tools", description: "Solid Centers, Live Centers & Dead Centers" },
  { icon: Ruler, title: "Measuring Tools", description: "Dividers, Calipers & Layout Tools" },
  { icon: SquareStack, title: "Workholding", description: "Fixture Plates, Clamps & More" },
  { icon: Wrench, title: "Precision Accessories", description: "Extension Sleeves & Special Tools" },
];

export default function CategoryBar() {
  return <section className={styles.section}><div className={styles.grid}>
    {categories.map(({ icon: Icon, title, description }) => <div key={title} className={styles.category}>
      {/* <Icon className={styles.icon} size={48} strokeWidth={1.2} /> */}
      <Image src={"/solid-center.jpg"} height={50} width={50} className={styles.icon} alt="img"/>
      <div className={styles.copy}><h3>{title}</h3><p>{description}</p></div>
      <div className={styles.arrow} aria-hidden="true">→</div>
    </div>)}
  </div></section>;
}
