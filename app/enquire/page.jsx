"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function EnquiryForm() {
  const [loading, setLoading] = useState(false);

  const inputStyle =
    "w-full rounded-lg border border-white/10 bg-[#171a1c] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] disabled:cursor-not-allowed disabled:opacity-60";

  const labelStyle = "mb-2 block text-sm font-medium text-gray-300";

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePhone = (value) =>
    /^[6-9]\d{9}$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      product: String(formData.get("product") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    // Client-side validation
    if (payload.name.length < 2 || payload.name.length > 100) {
      return toast.error("Name must be between 2 and 100 characters!");
    }

    if (!payload.email || !validateEmail(payload.email)) {
      return toast.error("Please enter a valid email address!");
    }

    if (!validatePhone(payload.phone)) {
      return toast.error("Enter a valid 10-digit Indian mobile number!");
    }

    if (payload.company.length > 150) {
      return toast.error("Company name is too long!");
    }

    const allowedProducts = [
      "Precision Tools",
      "Industrial Tools",
      "Cutting Tools",
      "Custom Requirements",
      "Other",
    ];

    if (!allowedProducts.includes(payload.product)) {
      return toast.error("Please select a valid product!");
    }

    if (payload.message.length < 10 || payload.message.length > 3000) {
      return toast.error(
        "Requirements must be between 10 and 3000 characters!"
      );
    }

    setLoading(true);

    try {
      const response = await toast.promise(
        axios.post("/api/enquiries", payload),
        {
          loading: "Submitting your enquiry...",
          success: (res) =>
            res.data.message || "Enquiry submitted successfully!",
          error: (error) =>
            error.response?.data?.message ||
            "Unable to submit enquiry!",
        }
      );

      console.log("Enquiry Response:", response.data);

      form.reset();
    } catch (error) {
      console.error("Enquiry Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="enquire"
      className="relative overflow-hidden bg-[#080a0b] px-5 py-20 text-white md:px-10"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#ff6a00]/10 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#ff6a00]">
            Get In Touch
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
            Let&apos;s Discuss Your
            <span className="block text-[#ff6a00]">
              Requirements.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-gray-400">
            Looking for high-quality precision tools? Share your
            requirements with us. Our team will help you find the
            right solution for your business.
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <p className="text-sm text-gray-500">Email Us</p>
              <a
                href="mailto:info@mercifultools.com"
                className="mt-1 inline-block text-white transition hover:text-[#ff6a00]"
              >
                info@mercifultools.com
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-500">Our Location</p>
              <p className="mt-1 text-white">Delhi, India</p>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="rounded-2xl border border-white/10 bg-[#111416] p-6 shadow-2xl md:p-9">
          <h3 className="text-2xl font-bold text-white">
            Enquire Now
          </h3>

          <p className="mb-8 mt-2 text-sm text-gray-400">
            Fill in the details below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className={labelStyle}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className={inputStyle}
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className={labelStyle}>
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Company name"
                  className={inputStyle}
                  autoComplete="organization"
                  maxLength={150}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelStyle}>
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className={inputStyle}
                  autoComplete="email"
                  maxLength={255}
                  required
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className={labelStyle}>
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  minLength={10}
                  placeholder="9876543210"
                  className={inputStyle}
                  required
                  disabled={loading}
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                />
              </div>
            </div>

            {/* Product */}
            <div>
              <label htmlFor="product" className={labelStyle}>
                Product Interested In *
              </label>

              <select
                id="product"
                name="product"
                className={inputStyle}
                required
                defaultValue=""
                disabled={loading}
              >
                <option value="" disabled>
                  Select a product
                </option>
                <option value="Precision Tools">
                  Precision Tools
                </option>
                <option value="Industrial Tools">
                  Industrial Tools
                </option>
                <option value="Cutting Tools">
                  Cutting Tools
                </option>
                <option value="Custom Requirements">
                  Custom Requirements
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="message" className={labelStyle}>
                Your Requirements *
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                minLength={10}
                maxLength={3000}
                placeholder="Tell us about your requirements..."
                className={`${inputStyle} resize-none`}
                required
                disabled={loading}
              />
              <p className="mt-2 text-right text-xs text-gray-500">
                Maximum 3000 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff6a00] px-6 py-4 font-bold text-white transition duration-300 hover:bg-white hover:text-[#ff6a00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </>
              ) : (
                "Submit Enquiry →"
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              Your information is safe with us.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
