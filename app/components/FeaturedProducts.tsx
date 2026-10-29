import { MoveRight } from "lucide-react";
import { products } from "@/app/components/data";
import ProductCard from "./ProductCard";
import styles from "@/app/styles/components/FeaturedProducts.module.css";
import Link from "next/link";

export default function FeaturedProducts() {
  return <section id="products" className={styles.section}>
    <div className={styles.glow} />
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Our range</p>
          <h2>Featured<br /><span>Products</span></h2>
          <div className={styles.rule} />
          <p className={styles.description}>Precision tools designed for accuracy, durability and professional performance.</p>
          <Link href="/products" className={styles.button}>View All Products <MoveRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.products}>
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </div>
  </section>;
}
