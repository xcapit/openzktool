'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
        copied
          ? 'bg-zk-green bg-opacity-20 text-zk-green border border-zk-green'
          : 'bg-stellar-purple bg-opacity-20 text-stellar-purple border border-stellar-purple hover:bg-opacity-30'
      } ${className}`}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
  )
}
