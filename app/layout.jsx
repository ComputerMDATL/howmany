import './globals.css'

export const metadata = {
  title: 'Ask how many?',
  description: 'Ask anything. Get a real answer with the math shown.',
  openGraph: {
    title: 'Ask how many?',
    description: 'Ask anything. Get a real answer with the math shown.',
    url: 'https://howmany.app',
    type: 'website',
    images: [{ url: 'https://howmany.app/og-default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/*
          GOOGLE ADSENSE — uncomment when approved.
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          />
        */}
        {children}
      </body>
    </html>
  )
}
