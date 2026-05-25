'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { authApi } from '@/lib/api/client'
import { ROUTES } from '@/config'
import toast from 'react-hot-toast'

type Mode = 'login' | 'register' | 'forgot'

export default function AuthPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [mode,        setMode]        = useState<Mode>('login')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [done,        setDone]        = useState(false)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [name,     setName]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirm) { toast.error('Passwords do not match'); return }
        if (password.length < 6)  { toast.error('Password must be at least 6 characters'); return }
        const res = await authApi.register({ name, email, password })
        if (!res.success) { toast.error(res.error ?? 'Registration failed'); return }
        setAuth(res.data!.user, res.data!.token)
        toast.success('Account created! Welcome 🎉')
        router.push(ROUTES.home)
      } else if (mode === 'login') {
        const res = await authApi.login({ email, password })
        if (!res.success) { toast.error(res.error ?? 'Invalid email or password'); return }
        setAuth(res.data!.user, res.data!.token)
        toast.success('Welcome back! 👋')
        router.push(ROUTES.home)
      } else {
        setDone(true)
        toast.success('Password reset link sent!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(228,0,43,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,82,162,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-[420px] animate-fade-up relative z-10">
        {/* Back link */}
        <Link href={ROUTES.home}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-700 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        {/* Card */}
        <div className="rounded-[32px] overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(48px) saturate(2.2)',
            border: '1px solid rgba(255,255,255,0.90)',
            boxShadow: '0 0 0 0.5px rgba(255,255,255,0.78), 0 40px 90px rgba(0,0,0,0.13), inset 0 1.5px 0 rgba(255,255,255,1)',
          }}>

          {/* Top banner */}
          <div className="relative px-8 pt-8 pb-7"
            style={{
              background: 'linear-gradient(135deg, rgba(228,0,43,0.08) 0%, rgba(0,82,162,0.06) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.70)',
            }}>
            <div className="flex items-center justify-center gap-3 text-3xl mb-4">🇰🇷 ↔ 🇺🇿</div>
            <h1 className="font-display text-[26px] font-bold text-zinc-900 text-center leading-tight">
              {mode === 'login'    ? 'Welcome Back'
               : mode === 'register' ? 'Create Account'
               : 'Reset Password'}
            </h1>
            <p className="text-sm text-zinc-400 text-center mt-1.5">
              {mode === 'login'    ? 'Sign in to your KorUzMarket account'
               : mode === 'register' ? 'Join thousands of shoppers'
               : "Enter your email and we'll send a reset link"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {done ? (
              <div className="text-center py-6">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-zinc-900 mb-2">Check your email</h3>
                <p className="text-sm text-zinc-400 mb-6">We sent a password reset link to {email}</p>
                <button onClick={() => { setDone(false); setMode('login') }}
                  className="btn-brand h-11 px-6 w-full flex items-center justify-center gap-2 text-sm font-bold">
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text" value={name} onChange={e => setName(e.target.value)} required
                        placeholder="Aziz Karimov"
                        className="input pl-10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="you@example.com"
                      className="input pl-10"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label mb-0">Password</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('forgot')}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder="••••••••"
                        className="input pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="label">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm} onChange={e => setConfirm(e.target.value)} required
                        placeholder="••••••••"
                        className="input pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirm && password !== confirm && (
                      <p className="text-xs text-red-500 mt-1.5">Passwords don't match</p>
                    )}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold mt-2 disabled:opacity-60">
                  {loading ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-400">or</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                {/* Toggle mode */}
                <div className="text-center text-sm">
                  {mode === 'login' ? (
                    <>
                      <span className="text-zinc-400">Don't have an account? </span>
                      <button type="button" onClick={() => setMode('register')}
                        className="font-bold text-red-600 hover:text-red-700 transition-colors">
                        Sign up free
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-zinc-400">Already have an account? </span>
                      <button type="button" onClick={() => setMode('login')}
                        className="font-bold text-red-600 hover:text-red-700 transition-colors">
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-zinc-600">Terms</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
