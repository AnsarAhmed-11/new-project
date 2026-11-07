"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/admin/Sidebar";
import {toast} from "sonner";

type Product = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
};
//  const categories = [
//   {
//     label: "Lathe Machine Tools",
//     value: "lathe-machine-tools",
//   },
//   {
//     label: "Revolving Centres",
//     value: "revolving-centres",
//   },
//   {
//     label: "Dead Centres",
//     value: "dead-centres",
//   },
//   {
//     label: "Precision Measuring Tools",
//     value: "precision-measuring-tools",
//   },
//   {
//     label: "Machine Tool Accessories",
//     value: "machine-tool-accessories",
//   },
//   {
//     label: "Collets & Sleeves",
//     value: "collets-sleeves",
//   },
//   {
//     label: "Tool Holders",
//     value: "tool-holders",
//   },
//   {
//     label: "Special Purpose Tools",
//     value: "special-purpose-tools",
//   },
//   {
//     label: "Other Products",
//     value: "other-products",
//   },
// ];
export default function ProductManager() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        setError("Unable to load products.");
        return;
      }

      const result = await response.json();
      setProducts(Array.isArray(result.data) ? result.data : []);
    } catch {
      setError("Unable to load products.");
    }
  }
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return toast.error("Product name is required");
    }

    if (!slug.trim()) {
      return toast.error("Product slug is required");
    }

    if (!description.trim()) {
      return toast.error("Product description is required");
    }

    if (!sku.trim()) {
      return toast.error("Product SKU is required");
    }

    if (!["inStock", "outOfStock"].includes(status)) {
  return toast.error("Please select a valid product status");
}
    if (!image) {
      return toast.error("image is required");
    }
    console.log(status);

    setSaving(true);
    setMessage("");
    // setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Unable to save product.");
        return;
      }

      setMessage(result.message || "Product added successfully.");
      setName("");
      setDescription("");
      setImage(null);
      event.currentTarget.reset();
      // await loadProducts();
    } catch {
      setError("Unable to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#080a0b] text-white lg:flex">
      <Sidebar onLogout={logout} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#ff6a00]">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add products and upload their images.
          </p>
        </div>
        <section className="max-w-2xl rounded-xl border border-white/10 bg-[#101315] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <form onSubmit={submit} className="mt-5 grid gap-4" noValidate>
            {/* Product name */}
            <label className="grid gap-2 text-sm text-gray-300">
              Product name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-white outline-none focus:border-[#ff6a00]"
                placeholder="Enter product name"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Product slug
              <input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-white outline-none focus:border-[#ff6a00]"
                placeholder="e.g. hydraulic-pipe-cutter"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Product Sku / Code
              <input
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-white outline-none focus:border-[#ff6a00]"
                placeholder="e.g. MTL-HP-001"
              />
            </label>
            {/* Product Description */}
            <label className="grid gap-2 text-sm text-gray-300">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-white outline-none focus:border-[#ff6a00]"
                placeholder="Enter detailed product description"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-white outline-none focus:border-[#ff6a00]"
              > 
                <option value="" disabled>Select Status</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Product image
              <input
                required
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="rounded-lg border border-white/10 bg-[#171a1c] px-3 py-2.5 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-[#ff6a00] file:px-3 file:py-1.5 file:font-semibold file:text-black"
              />
              <span className="text-xs text-gray-500">
                JPG, PNG, or WebP · max 5 MB
              </span>
            </label>
            {message && <p className="text-sm text-green-400">{message}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              disabled={saving}
              className="w-fit rounded-lg bg-[#ff6a00] px-5 py-2.5 font-semibold text-black disabled:opacity-50"
            >
              {saving ? "Uploading…" : "Add product"}
            </button>
          </form>
        </section>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#101315]"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={640}
                height={384}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold">{product.name}</h2>
                {product.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {product.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
