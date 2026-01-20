"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate password reset");
      }

      if (data.token) {
        setSuccessMessage("Email confirmed. Redirecting to password reset page...");
        setEmail(""); // Clear email field on success
        setTimeout(() => {
          router.push(`/admin/reset-password?token=${data.token}`);
        }, 1500); // Redirect after a short delay
      } else {
        setSuccessMessage(data.message || "If an account with that email exists, you can proceed to reset password.");
        setEmail(""); // Clear email field on success
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-neutral-50">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#261592] rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-[#56a7d7] rounded-tr-full" />

      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-0 p-4 md:p-8">
        {/* Right Panel - Form Section (now on left visually) */}
        <div className="w-full md:w-[500px] h-[500px] bg-white rounded-3xl md:rounded-l-3xl md:rounded-r-none flex flex-col items-center justify-center p-12 shadow-2xl order-2 md:order-1">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-[#261592]">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-600">
                Enter your email to proceed to set a new password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-500/10 text-green-700 px-4 py-3 rounded-md text-sm">
                  {successMessage}
                </div>
              )}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="pl-12 h-12 bg-gray-50 border-0 rounded-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#261592] hover:bg-[#56a7d7] text-white rounded-full font-medium text-sm uppercase tracking-wider transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Reset"}
              </Button>
            </form>
            <div className="text-center text-sm mt-4">
              <Link href="/admin/login" className="text-[#261592] hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Left Panel - Hello Section (now on right visually) */}
        <div className="w-full md:w-[400px] h-[500px] bg-[#261592] rounded-3xl md:rounded-r-3xl md:rounded-l-none flex flex-col items-center justify-center p-12 relative overflow-hidden shadow-2xl order-1 md:order-2">
          {/* Decorative circles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full" />

          {/* Logo */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/90 rounded flex items-center justify-center">
              <img src="/images/Logo-01.png" alt="Logo" className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white">Trouble logging in?</h1>
            <p className="text-white/90 text-sm max-w-xs leading-relaxed">
              Don't worry, we'll help you get back into your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}