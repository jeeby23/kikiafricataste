"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Kiki African Taste</p>
        </div>

        <Card className="border-0 shadow-xl shadow-gray-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {sent ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription className="text-gray-500">
              {sent
                ? "We've sent a reset link if that email exists in our system."
                : "Enter your admin email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          {sent ? (
            <CardContent className="pb-6">
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    A reset link was sent to
                  </p>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                </div>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  The link expires in 15 minutes. Check your spam folder if you don't see it.
                </p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@kiki.com"
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to sign in
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400">
          Protected admin area · Kiki African Taste © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}