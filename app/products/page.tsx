import Navbar from "@/app/components/Navbar";
import ProductCard from "@/app/components/ProductCard";
import { products } from "@/app/components/data";
import Footer from "@/app/components/Footer";
import styles from "@/app/styles/components/ProductsPage.module.css";

export default function ProductsPage() {
  return (
    <main>
      <Navbar />

      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Our range</p>
          <h1>All <span>Products</span></h1>
          <p className={styles.description}>
            Precision tools designed for accuracy, durability and professional performance.
          </p>

          <div className={styles.products}>
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
