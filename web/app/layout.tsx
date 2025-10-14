import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://openzktool.vercel.app'),
  title: {
    default: 'OpenZKTool - Zero-Knowledge Proofs for Stellar & EVM Chains',
    template: '%s | OpenZKTool'
  },
  description: 'Open-source toolkit for building privacy-preserving applications with zero-knowledge proofs on Stellar Soroban and Ethereum. Generate and verify proofs in minutes, not months. Digital Public Good.',
  keywords: [
    'zero-knowledge proofs',
    'zk-SNARKs',
    'Stellar',
    'Soroban',
    'Ethereum',
    'privacy',
    'KYC',
    'compliance',
    'DeFi',
    'blockchain',
    'Groth16',
    'Circom',
    'multi-chain',
    'digital public good',
    'open source',
    'cryptography'
  ],
  authors: [
    { name: 'Fernando Boiero', url: 'https://github.com/fboiero' },
    { name: 'Xcapit Labs', url: 'https://github.com/xcapit' }
  ],
  creator: 'Xcapit Labs',
  publisher: 'Xcapit Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openzktool.vercel.app',
    title: 'OpenZKTool - Zero-Knowledge Proofs for Stellar & EVM Chains',
    description: 'Open-source toolkit for building privacy-preserving applications with zero-knowledge proofs on Stellar Soroban and Ethereum.',
    siteName: 'OpenZKTool',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'OpenZKTool - Zero-Knowledge Privacy Toolkit'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenZKTool - Zero-Knowledge Proofs for Stellar & EVM',
    description: 'Open-source toolkit for privacy-preserving applications. Generate and verify ZK proofs on Stellar Soroban and Ethereum.',
    images: ['/og-image.svg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.svg'
  },
  manifest: '/manifest.json',
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenZKTool',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    description: 'Open-source toolkit for building privacy-preserving applications with zero-knowledge proofs on Stellar Soroban and Ethereum',
    url: 'https://openzktool.vercel.app',
    author: {
      '@type': 'Organization',
      name: 'Xcapit Labs',
      url: 'https://github.com/xcapit'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1'
    },
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    programmingLanguage: ['TypeScript', 'Rust', 'Solidity', 'Circom'],
    softwareVersion: '0.2.0',
    keywords: 'zero-knowledge proofs, privacy, Stellar, Soroban, Ethereum, blockchain, zk-SNARKs',
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
