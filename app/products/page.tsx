"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import CatalogProducts from "@/app/components/CatalogProducts";
import Footer from "@/app/components/Footer";
import styles from "@/app/styles/components/ProductsPage.module.css";

export default function ProductsPage() {
  return (
    <main>
      <Navbar />

      <section className={styles.section}>
        <div className={styles.container}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our range
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            All <span>Products</span>
          </motion.h1>
          <motion.p
            className={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            Precision tools designed for accuracy, durability and professional
            performance.
          </motion.p>

          <div className={styles.products}>
            <CatalogProducts />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
