'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {  Mail, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { useLogin } from '@/features/auth/auth.query'

export default function AdminLoginPage() {
  const router = useRouter()
  const login = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!email || !password) {
      setValidationError('Please enter both email and password.')
      return
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.error) {
            setValidationError(res.error)
            return
          }
          router.push('/admin')
        },
      },
    )
  }

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
            <CardTitle className="text-xl font-semibold text-gray-900">Admin Portal</CardTitle>
            <CardDescription className="text-gray-500">
              Sign in to manage your store
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link href="/forgot-password"></Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {(login.isError || validationError) && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <p className="text-sm text-red-600">
                    {validationError ?? 'Invalid credentials. Please try again.'}
                  </p>
                </div>
              )}
              <div className="flex text-center justify-between py-2 ">
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-600 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-medium tracking-wide"
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Separator className="my-1" />

              <p className="text-xs text-center text-gray-400">
                Having trouble?{' '}
                <a
                  href="/reset-password"
                  className="text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
                >
                  Reset your password
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-400">
          Protected admin area · Kiki African Taste © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
