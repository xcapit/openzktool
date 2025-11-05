# Example 2: React App Integration

> Browser-based proof generation with MetaMask integration

**Status:** Structure only - Implementation coming in next phase

---

## 📖 What You'll Learn

- Browser-based proof generation
- MetaMask wallet integration
- Real-time proof verification
- UI/UX best practices for ZK apps

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📁 Project Structure

```
2-react-app/
├── README.md
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.tsx            # Main app component
    ├── components/
    │   ├── ProofGenerator.tsx
    │   ├── ProofVerifier.tsx
    │   └── WalletConnect.tsx
    ├── hooks/
    │   └── useOpenZKTool.ts
    └── utils/
        └── proof.ts
```

---

## 💻 Features

- - Connect MetaMask wallet
- - Generate proof in browser
- - Verify proof on-chain (Ethereum)
- - Display proof details
- - Copy proof to clipboard
- - Responsive design

---

## 🎨 UI Components

### ProofGenerator Component

```typescript
import { useState } from 'react';
import { useOpenZKTool } from '../hooks/useOpenZKTool';

export function ProofGenerator() {
  const { generateProof, loading } = useOpenZKTool();
  const [inputs, setInputs] = useState({
    age: 25,
    balance: 150,
    country: 32
  });

  const handleGenerate = async () => {
    const { proof, publicSignals } = await generateProof(inputs);
    // Display proof
  };

  return (
    <div className="proof-generator">
      {/* UI implementation */}
    </div>
  );
}
```

---

## 🧪 Testing

```bash
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

---

## 📚 Next Steps

- Try [Example 3: Node.js Backend](../3-nodejs-backend/)
- Learn about [custom circuits](../5-custom-circuit/)

---

## 🔗 Resources

- [React Documentation](https://react.dev/)
- [MetaMask Docs](https://docs.metamask.io/)
- [SDK Documentation](../../sdk/README.md)
