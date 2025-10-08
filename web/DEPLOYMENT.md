# Deployment Guide - ZKPrivacy Website

## Quick Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to the web directory
cd web

# Deploy to production
vercel --prod
```

Follow the prompts:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Your Vercel account
3. **Link to existing project?** → No
4. **What's your project's name?** → zkprivacy (or your choice)
5. **In which directory is your code located?** → ./ (current directory)

Your site will be live at: `https://zkprivacy.vercel.app` (or your custom domain)

---

### Method 2: Vercel Dashboard (Easiest for GitHub)

1. **Push to GitHub:**
   ```bash
   cd /Users/fboiero/Documents/STELLAR/stellar-privacy-poc
   git add web/
   git commit -m "feat: add ZKPrivacy landing page with multi-chain support"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `stellar-privacy-poc`
   - Click "Import"

3. **Configure Project:**
   - **Root Directory:** `web`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
   - Click "Deploy"

4. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., privacy.xcapit.com)
   - Configure DNS as instructed

---

### Method 3: Manual Static Hosting

The build output in `web/out/` is fully static and can be deployed to:

#### Netlify
```bash
npm install -g netlify-cli
cd web
netlify deploy --prod --dir=out
```

#### GitHub Pages
```bash
# Copy out/ to docs/ in root
cp -r web/out ../docs
git add docs/
git commit -m "docs: add website"
git push

# Enable in GitHub Settings → Pages → Deploy from /docs
```

#### Any Static Host
Upload the `web/out/` directory to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages

---

## Environment Variables (Optional)

Currently the site is fully static. If you add dynamic features, configure in Vercel:

```bash
# Example for analytics
NEXT_PUBLIC_ANALYTICS_ID=your-id
```

---

## Custom Domain Setup

### On Vercel:
1. Project Settings → Domains
2. Add domain: `privacy.xcapit.com`
3. Add DNS records as shown:
   ```
   Type: CNAME
   Name: privacy
   Value: cname.vercel-dns.com
   ```

### SSL/TLS
- Automatically provisioned by Vercel
- No configuration needed

---

## Performance Optimizations

The site is already optimized with:
- ✅ Static export (no server needed)
- ✅ Automatic code splitting
- ✅ Image optimization disabled (unoptimized for static export)
- ✅ Tailwind CSS purging (only used classes included)
- ✅ Security headers in vercel.json

### Additional Optimizations (Optional):

1. **Enable Analytics:**
   ```bash
   # In vercel.json
   {
     "analytics": true
   }
   ```

2. **Add Speed Insights:**
   ```bash
   npm install @vercel/speed-insights
   ```

   In `app/layout.tsx`:
   ```tsx
   import { SpeedInsights } from "@vercel/speed-insights/next"

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     )
   }
   ```

---

## Monitoring

### Vercel Dashboard
- **Analytics:** View page views, top pages, referrers
- **Speed Insights:** Core Web Vitals, performance scores
- **Logs:** Build logs, function logs (if you add API routes)

### Custom Analytics
Add Google Analytics, Plausible, or Fathom:

```tsx
// app/layout.tsx
<Script src="https://plausible.io/js/script.js" data-domain="your-domain.com" />
```

---

## Continuous Deployment

Once connected to GitHub:
1. Every push to `main` → Automatic production deploy
2. Pull requests → Preview deployments
3. Branches → Preview deployments

### Preview URLs
Each PR gets a unique URL:
```
https://stellar-privacy-poc-git-<branch>-<username>.vercel.app
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
cd web
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 404 on Refresh
- Not an issue with static export
- Vercel handles this automatically with `cleanUrls: true`

### Slow Build Times
- Current build: ~10-15 seconds
- If it gets slower, check for unnecessary dependencies

---

## Next Steps

1. **Deploy:** Use one of the methods above
2. **Custom Domain:** Add your domain in Vercel settings
3. **Analytics:** Optional, add tracking if needed
4. **SEO:** Already configured with metadata in layout.tsx
5. **Share:** Add the URL to your README and documentation

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project Issues:** https://github.com/xcapit/stellar-privacy-poc/issues

---

**Ready to deploy? Run:** `vercel --prod` 🚀
