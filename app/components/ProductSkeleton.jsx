'use client';

import styles from "@/app/styles/components/ProductSkeleton.module.css";

function ProductSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonImage} />

      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonCopy}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonDescription} />
          <div className={styles.skeletonDescriptionShort} />
        </div>
        <div className={styles.skeletonArrow} />
      </div>
    </div>
  );
}

export default function ProductLoadingSkeleton({ count = 8 }) {
  return (
    <div
      className={styles.skeletonGrid}
      role="status"
      aria-label="Loading products"
    >
      <span className={styles.srOnly}>Loading products...</span>

      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
