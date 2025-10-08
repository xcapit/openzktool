# Quick Start - ZKPrivacy Website

## 🚀 Deploy in 3 Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Navigate to Web Directory
```bash
cd web
```

### 3. Deploy to Production
```bash
vercel --prod
```

That's it! Your website will be live in ~60 seconds.

---

## 🖥️ Local Development

### Run Development Server
```bash
cd web
npm install
npm run dev
```

Visit: `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Output: `web/out/` (fully static)

---

## 📝 What's Included

- ✅ **Hero** - Main headline with metrics
- ✅ **Features** - 6 core features grid
- ✅ **Interoperability** - Multi-chain showcase
- ✅ **Architecture** - How it works + code examples
- ✅ **Use Cases** - 6 real-world applications
- ✅ **Roadmap** - 5-phase development plan (grant-funded)
- ✅ **Footer** - Links and resources

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```js
stellar: {
  purple: '#7B61FF',  // Change primary color
  blue: '#00D1FF',    // Change secondary color
}
```

### Content
Edit component files in `components/`:
- `Hero.tsx` - Main headline
- `Roadmap.tsx` - Development phases
- `UseCases.tsx` - Application examples

---

## 📚 Full Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **WEBSITE_SUMMARY.md** - Complete feature breakdown

---

**Ready to deploy?** Run: `vercel --prod` 🎯
