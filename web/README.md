# OpenZKTool - Landing Page

This is the landing page for **OpenZKTool**, showcasing the interoperable zero-knowledge privacy toolkit for blockchain applications.

## Tech Stack

- **Next.js 14** - React framework with static export
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Deployment platform

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

The site will be available at `http://localhost:3000`

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
cd web
vercel --prod
```

### Option 2: GitHub Integration

1. Push the `web/` directory to GitHub
2. Import the project in Vercel dashboard
3. Set the root directory to `web`
4. Deploy

### Option 3: Manual Deploy

1. Build the project: `npm run build`
2. Upload the `out/` directory to any static hosting

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Features grid
│   ├── Interoperability.tsx  # Multi-chain support
│   ├── Architecture.tsx  # How it works
│   ├── UseCases.tsx      # Real-world applications
│   ├── Roadmap.tsx       # Development roadmap
│   └── Footer.tsx        # Footer
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind config
├── next.config.js        # Next.js config
└── vercel.json          # Vercel deployment config
```

## Features Highlighted

- ✅ Zero-Knowledge Proofs (Groth16 SNARKs)
- ✅ Multi-Chain Support (Soroban, Ethereum, Polygon, L2s)
- ✅ Privacy-Preserving KYC Compliance
- ✅ Blockchain-Agnostic SDK
- ✅ Open Source (AGPL-3.0)
- ✅ Grant-Funded Roadmap with Advanced Features

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
stellar: {
  purple: '#7B61FF',
  blue: '#00D1FF',
  dark: '#0A0E27',
},
zk: {
  green: '#00FF94',
  cyan: '#00F0FF',
}
```

### Content

All content is in the component files. Edit:
- `components/Hero.tsx` - Main headline and CTA
- `components/Roadmap.tsx` - Development phases and grant info
- `components/UseCases.tsx` - Application examples

## License

AGPL-3.0-or-later - Same as the main project

## Support

- **Repository:** https://github.com/xcapit/stellar-privacy-poc
- **Issues:** https://github.com/xcapit/stellar-privacy-poc/issues
- **Xcapit Labs:** https://xcapit.com
