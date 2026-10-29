import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import styles from "@/app/styles/components/ProductCard.module.css";

type ProductCardProps = { name: string; image: string; description?: string };

export default function ProductCard({ name, image, description }: ProductCardProps) {
  return <article className={styles.card}>
    <div className={styles.imageWrap}>
      <Image
        src={image}
        alt={name}
        fill
        sizes="(min-width: 1280px) 18vw, (min-width: 640px) 50vw, 100vw"
        className={styles.image}
      />
    </div>
    <div className={styles.info}>
      <div>
        <h3>{name}</h3>
        {description && <p>{description}</p>}</div>
      <button aria-label={`View ${name}`} className={styles.arrow}>
        <ArrowUpRight size={17} aria-hidden="true" />
      </button>
    </div>
  </article>;
}
