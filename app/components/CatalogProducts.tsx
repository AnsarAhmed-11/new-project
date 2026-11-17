"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductPrice } from "@/app/components/ProductCard";
import styles from "@/app/styles/components/ProductsPage.module.css";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl: string;
  sourceUrl?: string | null;
  prices?: ProductPrice[];
};

function ProductSkeleton() {
  return (
    <article className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonDescription} />
      </div>
    </article>
  );
}

function ProductLoadingSkeleton({ count }: { count: number }) {
  return (
    <div
      className={styles.skeletonGrid}
      role="status"
      aria-label="Loading products"
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductSkeleton key={index} />
      ))}
      <span className={styles.srOnly}>Loading products…</span>
    </div>
  );
}

export default function CatalogProducts({ limit }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((result) =>
        setProducts(Array.isArray(result.data) ? result.data : []),
      )
      .catch(() => {
        if (!controller.signal.aborted) setProducts([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) return <ProductLoadingSkeleton count={limit ?? 8} />;

  if (!products.length)
    return <p className={styles.empty}>No products are available yet.</p>;

  return (
    <>
      {(limit ? products.slice(0, limit) : products).map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </>
  );
}
