"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔥 Dummy authentication (replace later with backend)
    setTimeout(() => {
      if (email === "admin@kiki.com" && password === "123456") {
        localStorage.setItem("admin", "true");
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm">

        {/* Header */}
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access dashboard
          </CardDescription>

          <CardAction>
            <Button variant="link">Help</Button>
          </CardAction>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kiki.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <span className="ml-auto text-xs text-gray-500">
                  Forgot?
                </span>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmail("admin@kiki.com");
                setPassword("123456");
              }}
            >
              Use Demo Credentials
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}