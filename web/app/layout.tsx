import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZKPrivacy - Interoperable Zero-Knowledge Privacy for Blockchain',
  description: 'Build privacy-preserving applications across any chain with zero-knowledge proofs. Multi-chain KYC compliance for DeFi, identity, and regulatory use cases.',
  keywords: 'zero-knowledge proofs, privacy, blockchain, KYC, compliance, interoperability, DeFi, multi-chain, zk-SNARKs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
