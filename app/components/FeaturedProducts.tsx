"use client";

import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/app/components/data";
import ProductCard from "./ProductCard";
import styles from "@/app/styles/components/FeaturedProducts.module.css";
import Link from "next/link";

export default function FeaturedProducts() {
  return <section id="products" className={styles.section}>
    <div className={styles.glow} />
    <div className={styles.container}>
      <div className={styles.layout}>
        <motion.div className={styles.intro} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .6 }}>
          <p className={styles.eyebrow}>Our range</p>
          <h2>Featured<br /><span>Products</span></h2>
          <div className={styles.rule} />
          <p className={styles.description}>Precision tools designed for accuracy, durability and professional performance.</p>
          <Link href="/products" className={styles.button}>View All Products <MoveRight size={17} aria-hidden="true" /></Link>
        </motion.div>
        <div className={styles.products}>
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      </div>
    </div>
  </section>;
}
