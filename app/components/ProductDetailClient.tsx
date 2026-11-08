"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { ProductPrice } from "@/app/components/ProductCard";
import styles from "@/app/styles/components/ProductDetails.module.css";

type Product = { name: string; description?: string | null; imageUrl: string; sourceUrl?: string | null; slug: string; sku?: string | null; prices: ProductPrice[] };

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => setProduct(result.data))
      .catch((error) => { if (error.name !== "AbortError") setMissing(true); });
    return () => controller.abort();
  }, [slug]);

  const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  return <main className={styles.page}>
    <Navbar />
    {!product && !missing && <div className={styles.notice}>Loading product…</div>}
    {missing && <div className={styles.notice}><h1>Product not found</h1><Link href="/products">Back to products</Link></div>}
    {product && <section className={styles.main}>
      <Link href="/products" className={styles.back}><ArrowLeft size={16} /> Back to products</Link>
      <div className={styles.layout}>
        <div className={styles.imageWrap}><Image src={product.imageUrl || "/solid-center.jpg"} alt={product.name} fill priority sizes="(min-width: 800px) 52vw, 100vw" className={styles.image} onError={(event) => { event.currentTarget.src = "/solid-center.jpg"; }} /></div>
        <section className={styles.copy}>
          <p className={styles.eyebrow}>Merciful Tools catalogue</p>
          <h1 className={styles.title}>{product.name}</h1>
          {product.description && <p className={styles.description}>{product.description}</p>}
          <div className={styles.meta}>{product.sku && <span>SKU: {product.sku}</span>}<span>Price list No. 9</span></div>
          <div className={styles.priceSection}><h2>Available sizes and prices</h2>{product.prices.length ? <div className={styles.prices}>{product.prices.map((item) => <div className={styles.row} key={`${item.size}-${item.price}`}><span>{item.size}</span><b>{item.price == null ? "Price on request" : formatter.format(Number(item.price))}</b></div>)}</div> : <p className={styles.description}>Contact us for available sizes and current pricing.</p>}</div>
          <div className={styles.actions}><Link href={`/enquire?product=${encodeURIComponent(product.name)}&size=${encodeURIComponent(product.prices[0]?.size || "")}`} className={styles.button}>Enquire about this product <ArrowUpRight size={17} /></Link>{product.sourceUrl && <a href={product.sourceUrl} target="_blank" rel="noreferrer" className={styles.secondary}>Image source</a>}</div>
        </section>
      </div>
    </section>}
    <Footer />
  </main>;
}
