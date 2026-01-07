"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";
import { API_URL } from "@/lib/config"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_URL}/api/contact/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Your quote request has been submitted successfully! We will get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          service: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            data.error || "Failed to submit quote request. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroHeader />
      <main className="min-h-screen pt-24 md:pt-36">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get a Quote</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us about your project and we'll get back to you with a
              customized quote
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+254 745808081"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Company Inc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="service" className="text-sm font-medium">
                Service Interested In <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a service</option>
                <option value="brand-identity">Brand Identity</option>
                <option value="content-creation">Content Creation</option>
                <option value="social-media">Social Media Management</option>
                <option value="marketing-strategy">Marketing Strategy</option>

                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Tell us about your project, goals, and any specific requirements..."
              />
            </div>

            {submitStatus.type && (
              <div
                className={`p-4 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1f89ca] hover:bg-[#1f89ca]/90 text-white px-8 py-6 text-base"
              >
                {isSubmitting ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>
          </form>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">info@tirzahcommunications.com</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+254 (745) 808081</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <a
                href="https://wa.link/isafci"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline"
              >
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
