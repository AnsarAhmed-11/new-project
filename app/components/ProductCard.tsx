import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/components/ProductCard.module.css";

export type ProductPrice = { size: string; price: number | null; currency?: string };
type ProductCardProps = {
  name: string;
  image?: string;
  imageUrl?: string;
  description?: string | null;
  prices?: ProductPrice[];
  slug?: string | null;
};

export default function ProductCard({ name, image, imageUrl, description, slug }: ProductCardProps) {
  const productImage = imageUrl || image || "/solid-center.jpg";
  const content = <motion.article className={styles.card} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55 }}>
    <div className={styles.imageWrap}>
      <Image
        src={productImage}
        alt={name}
        fill
        sizes="(min-width: 1280px) 18vw, (min-width: 640px) 50vw, 100vw"
        className={styles.image}
        loading="lazy"
        onError={(event) => { event.currentTarget.src = "/solid-center.jpg"; }}
      />
    </div>
    <div className={styles.info}>
      <div>
        <h3>{name}</h3>
        {description && <p>{description}</p>}</div>
      <span aria-hidden="true" className={styles.arrow}>
        <ArrowUpRight size={17} aria-hidden="true" />
      </span>
    </div>
  </motion.article>;
  return slug ? <Link className={styles.cardLink} href={`/products/${slug}`} aria-label={`View ${name}`}>{content}</Link> : content;
}
