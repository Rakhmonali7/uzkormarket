import type { Metadata } from 'next'
import './globals.css'
import { Header }       from '@/components/layout/header'
import { Footer }       from '@/components/layout/footer'
import { CartDrawer }   from '@/components/cart/cart-drawer'
import { Providers }    from '@/components/shared/providers'
import { WelcomePopup } from '@/components/shared/welcome-popup'

export const metadata: Metadata = {
  title:       'KorUzMarket — Korean Products for Uzbekistan',
  description: 'Shop authentic Korean products delivered to Uzbekistan. K-beauty, food, electronics and more.',
}

/** Inline script prevents flash of wrong theme before React hydrates */
const themeScript = `
(function(){try{
  var s=JSON.parse(localStorage.getItem('kum-ui')||'{}');
  if(s&&s.state&&s.state.theme==='dark'){
    document.documentElement.classList.add('dark');
  }
}catch(e){}})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <WelcomePopup />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
