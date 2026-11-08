"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductPrice } from "@/app/components/ProductCard";
import styles from "@/app/styles/components/ProductsPage.module.css";

type Product = { id: number; name: string; description?: string | null; imageUrl: string; sourceUrl?: string | null; prices?: ProductPrice[] };

export default function CatalogProducts({ limit }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => setProducts(Array.isArray(result.data) ? result.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <div className={styles.loading} aria-live="polite">Loading products…</div>;
  if (!products.length) return <p className={styles.empty}>No products are available yet.</p>;
  return <>{(limit ? products.slice(0, limit) : products).map((product) => <ProductCard key={product.id} {...product} />)}</>;
}
