
"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EnquiryForm() {


  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    console.log("Frontend Payload:", payload);

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/auth/enquire",
        payload
      );

      console.log("Backend Response:", response.data);

      toast.success(
        response.data.message || "Enquiry submitted successfully!"
      );

      form.reset();

    } catch (error) {
      console.error("Enquiry Error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Unable to submit enquiry!"
        );
      } else {
        toast.error("Something went wrong!");
      }

    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-white/10 bg-[#171a1c] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]";

  const labelStyle =
    "mb-2 block text-sm font-medium text-gray-300";

  return (
    <section
      id="enquire"
      className="relative overflow-hidden bg-[#080a0b] px-5 py-20 md:px-10"
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
            Looking for high-quality precision tools?
            Share your requirements with us. Our team
            will help you find the right solution for
            your business.
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <p className="text-sm text-gray-500">Email Us</p>
              <p className="mt-1 text-white">
                info@mercifultools.com
              </p>
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

          <p className="mt-2 mb-8 text-sm text-gray-400">
            Fill in the details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className={labelStyle}>
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Company Name
                </label>
                <input
                  name="company"
                  type="text"
                  placeholder="Company name"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Phone Number *
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className={inputStyle}
                  required
                />
              </div>

            </div>

            <div>
              <label className={labelStyle}>
                Product Interested In *
              </label>

              <select
                name="product"
                className={inputStyle}
                required
                defaultValue=""
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

            <div>
              <label className={labelStyle}>
                Your Requirements *
              </label>

              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your requirements..."
                className={`${inputStyle} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#ff6a00] px-6 py-4 font-bold text-white transition duration-300 hover:bg-white hover:text-[#ff6a00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Enquiry →"}
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
