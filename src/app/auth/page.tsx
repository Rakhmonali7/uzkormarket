'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store'
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
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
        // TODO: connect to backend /api/auth/register
        // const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
        toast.success('Account created! Please check your email to verify.')
        setMode('login')
      } else if (mode === 'login') {
        // TODO: connect to backend /api/auth/login
        // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
        // Mock success for now:
        setAuth({ id: '1', email, name: email.split('@')[0], role: 'buyer', isVerified: true } as any, 'mock-token')
        toast.success('Welcome back! 👋')
        router.push(ROUTES.home)
      } else if (mode === 'forgot') {
        // TODO: connect to backend /api/auth/forgot-password
        toast.success('Reset link sent! Check your email.')
        setMode('login')
      }
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    login:    { head: 'Welcome back',        sub:  'Sign in to your account' },
    register: { head: 'Create account',      sub:  'Join KorUzMarket today' },
    forgot:   { head: 'Reset password',      sub:  'We\'ll send you a reset link' },
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F2F2F7] dark:bg-surface-950 px-4 py-10">

      {/* ── Subtle glass blobs ───────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-brand w-[600px] h-[600px] -top-32 -right-32 animate-float" />
        <div className="blob-cobalt w-[500px] h-[500px] -bottom-24 -left-24 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      </div>

      <div className="relative w-full max-w-md">

        {/* ── Logo ──────────────────────────────────────────────────── */}
        <div className="mb-8 text-center animate-fade-up">
          <Link href={ROUTES.home} className="inline-flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C1C1E] text-white font-bold text-xl shadow-brand">
              K
              <div className="absolute inset-0 rounded-2xl bg-gradient-glass opacity-10" />
            </div>
            <div className="text-left">
              <div className="font-display text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                KorUz<span className="text-gradient-brand">Market</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-medium tracking-wide">Korea ↔ Uzbekistan</div>
            </div>
          </Link>
        </div>

        {/* ── Card ──────────────────────────────────────────────────── */}
        <div
          className="card-glass p-8 animate-fade-up"
          style={{ animationDelay: '60ms', borderRadius: '24px' }}
        >
          {/* Mode toggle */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-7">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200',
                    mode === m
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-soft'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  )}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          <div className="mb-6">
            {mode === 'forgot' && (
              <button
                onClick={() => setMode('login')}
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </button>
            )}
            <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              {titles[mode].head}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{titles[mode].sub}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name — register only */}
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Aziza Karimova"
                    className="input pl-10" required autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10" required autoFocus autoComplete="email"
                />
              </div>
            </div>

            {/* Password — login & register */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label !mb-0">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot')}
                      className="text-xs text-brand-500 hover:text-brand-600 font-semibold transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                    className="input pl-10 pr-10" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm password — register only */}
            {mode === 'register' && (
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-10 pr-10" required autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className={cn(
                'relative w-full h-12 rounded-xl font-semibold text-sm text-white',
                'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
                'shadow-brand hover:shadow-brand-lg',
                'transition-all duration-200',
                'flex items-center justify-center gap-2',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'overflow-hidden shine'
              )}
            >
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {mode === 'login'    ? 'Sign In'        :
                   mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* T&C for register */}
          {mode === 'register' && (
            <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
              By creating an account you agree to our{' '}
              <Link href="#" className="hover:text-zinc-600 underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="#" className="hover:text-zinc-600 underline">Privacy Policy</Link>
            </p>
          )}
        </div>

        {/* Seller CTA */}
        <div
          className="mt-4 card-glass p-4 text-center animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Want to sell on KorUzMarket?{' '}
            <Link
              href="/seller/register"
              className="font-semibold text-cobalt-500 hover:text-cobalt-600 transition-colors"
            >
              Become a seller →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
