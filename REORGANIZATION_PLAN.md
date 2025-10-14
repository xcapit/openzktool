# Repository Reorganization Plan

## Current Issues
- 20+ markdown files in root directory
- Multiple shell scripts in root
- Inconsistent organization

## Proposed Structure

```
stellar-privacy-poc/
├── docs/
│   ├── guides/          # User guides and tutorials
│   │   ├── QUICKSTART.md
│   │   ├── QUICK_START.md
│   │   ├── COMPLETE_DEMO.md
│   │   ├── COMPLETE_TUTORIAL.md
│   │   ├── DEMO.md
│   │   ├── DEMO_GUIDE.md
│   │   └── VIDEO_DEMO.md
│   ├── architecture/    # Technical documentation
│   │   ├── CONTRACTS_ARCHITECTURE.md
│   │   ├── CRYPTOGRAPHIC_COMPARISON.md
│   │   ├── PLATFORM_INDEPENDENCE.md
│   │   └── SCRIPTS_OVERVIEW.md
│   ├── testing/         # Testing documentation
│   │   └── TESTING_STRATEGY.md
│   ├── deployment/      # Deployment guides
│   │   └── TESTNET_DEPLOYMENT.md
│   ├── governance/      # Project governance
│   │   ├── CODE_OF_CONDUCT.md
│   │   ├── DO_NO_HARM.md
│   │   ├── PRIVACY.md
│   │   └── SDG_MAPPING.md
│   ├── analytics/       # Project analytics
│   │   ├── ANALYTICS.md
│   │   └── ROADMAP.md
│   └── video/           # Video production
│       └── VIDEO_RECORDING_GUIDE.md
├── scripts/             # All executable scripts
│   ├── demo/
│   │   ├── demo_multichain.sh
│   │   ├── demo_privacy_proof.sh
│   │   └── demo_video.sh
│   ├── testing/
│   │   ├── test_full_flow.sh
│   │   ├── test_full_flow_auto.sh
│   │   └── quick_test.sh
│   └── pipeline/
│       └── complete_pipeline.sh
├── circuits/            # (keep as is)
├── contracts/           # (keep as is)
├── soroban/             # (keep as is)
├── evm/                 # (keep as is)
├── evm-verification/    # (keep as is)
├── web/                 # (keep as is)
├── examples/            # (keep as is)
├── tools/               # (keep as is)
├── sdk/                 # (keep as is)
├── README.md            # Main README
├── LICENSE              # License file
└── .gitignore          # Git ignore

## Files to Keep in Root
- README.md (main entry point)
- LICENSE (standard location)
- .gitignore
- package.json, package-lock.json (npm config)
```

## Benefits
1. Cleaner root directory
2. Logical grouping of documentation
3. Easier navigation
4. Better for new contributors
5. Professional organization
