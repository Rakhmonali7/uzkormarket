'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useUIStore } from '@/store'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:            60_000,
        gcTime:               300_000,
        retry:                1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserClient: QueryClient | undefined
function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  if (!browserClient) browserClient = makeQueryClient()
  return browserClient
}

// Syncs Zustand theme state → document class
function ThemeSync() {
  const theme = useUIStore(s => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(getQueryClient)

  return (
    <QueryClientProvider client={client}>
      <ThemeSync />
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2800,
          style: {
            background:   '#1c1917',
            color:        '#fafaf9',
            borderRadius: '14px',
            fontSize:     '13.5px',
            padding:      '12px 16px',
            boxShadow:    '0 8px 24px -4px rgba(0,0,0,0.25)',
          },
          success: {
            iconTheme: { primary: '#f97316', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  )
}
