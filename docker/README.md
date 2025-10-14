# Docker Setup

> Complete Docker environment for OpenZKTool development and testing

## 📁 Structure

```
docker/
├── README.md
├── Dockerfile.circuits       # Circom compilation environment
├── Dockerfile.soroban       # Rust + Stellar CLI
├── Dockerfile.evm           # Foundry + Node.js
├── Dockerfile.web           # Next.js web app
├── docker-compose.yml       # Orchestrate all services
├── docker-compose.dev.yml   # Development overrides
└── scripts/
    ├── health-check.sh
    └── init-testnet.sh
```

## 🚀 Quick Start

### Start All Services
```bash
docker-compose up -d
```

### Start Specific Service
```bash
docker-compose up circuits
docker-compose up soroban
docker-compose up evm
docker-compose up web
```

### Development Mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 🐳 Available Services

### 1. Circuits Service
Circom compilation and proof generation environment

```bash
# Build circuits
docker-compose run circuits bash -c "cd /workspace/circuits && npm run compile"

# Generate proof
docker-compose run circuits bash -c "cd /workspace/circuits/scripts && bash prove_and_verify.sh"
```

**Exposed:** Circuit artifacts at `./circuits/artifacts`

---

### 2. Soroban Service
Stellar/Soroban contract development and deployment

```bash
# Build contract
docker-compose run soroban cargo build --release --target wasm32-unknown-unknown

# Run tests
docker-compose run soroban cargo test

# Deploy to testnet
docker-compose run soroban bash /scripts/deploy-testnet.sh
```

**Exposed:**
- Soroban RPC: `http://localhost:8000`
- Horizon: `http://localhost:8001`

---

### 3. EVM Service
Ethereum/Foundry environment for contract testing

```bash
# Run Anvil (local EVM)
docker-compose up -d anvil

# Deploy contract
docker-compose run evm forge script deploy

# Run tests
docker-compose run evm forge test -vvv
```

**Exposed:**
- Anvil RPC: `http://localhost:8545`
- Chain ID: 31337

---

### 4. Web Service
Next.js web application

```bash
# Start development server
docker-compose up web

# Build production
docker-compose run web npm run build
```

**Exposed:**
- Web App: `http://localhost:3000`

---

## 🔧 Service Details

### Circuits (`Dockerfile.circuits`)
```dockerfile
FROM node:18-alpine

# Install Circom
RUN wget https://github.com/iden3/circom/releases/download/v2.1.9/circom-linux-amd64
RUN chmod +x circom-linux-amd64 && mv circom-linux-amd64 /usr/local/bin/circom

# Install snarkjs
RUN npm install -g snarkjs

WORKDIR /workspace
```

**Use Cases:**
- Circuit compilation
- Proof generation
- Trusted setup
- WASM generation

---

### Soroban (`Dockerfile.soroban`)
```dockerfile
FROM rust:1.75-slim

# Install Stellar CLI
RUN cargo install --locked stellar-cli

# Install wasm32 target
RUN rustup target add wasm32-unknown-unknown

# Install Soroban SDK
RUN cargo install --locked soroban-cli

WORKDIR /workspace
```

**Use Cases:**
- Contract compilation
- Unit testing
- Testnet deployment
- Contract invocation

---

### EVM (`Dockerfile.evm`)
```dockerfile
FROM ghcr.io/foundry-rs/foundry:latest

# Install Node.js
RUN apk add --no-cache nodejs npm

WORKDIR /workspace
```

**Use Cases:**
- Solidity compilation
- Contract testing
- Local blockchain (Anvil)
- Gas profiling

---

### Web (`Dockerfile.web`)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY web/package*.json ./
RUN npm ci

COPY web/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Use Cases:**
- Web development
- Production builds
- Static export

---

## 🌐 Docker Compose Configuration

### Main Services (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  circuits:
    build:
      context: .
      dockerfile: docker/Dockerfile.circuits
    volumes:
      - ./circuits:/workspace/circuits
      - circuits-artifacts:/workspace/circuits/artifacts

  soroban:
    build:
      context: .
      dockerfile: docker/Dockerfile.soroban
    volumes:
      - ./soroban:/workspace/soroban
      - cargo-cache:/usr/local/cargo
    ports:
      - "8000:8000"  # Soroban RPC
      - "8001:8001"  # Horizon

  evm:
    build:
      context: .
      dockerfile: docker/Dockerfile.evm
    volumes:
      - ./evm-verification:/workspace/evm
    ports:
      - "8545:8545"  # Anvil RPC

  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    volumes:
      - ./web:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development

volumes:
  circuits-artifacts:
  cargo-cache:
```

---

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
# Build all images
docker-compose build

# Start core services
docker-compose up -d soroban evm

# Compile circuits
docker-compose run circuits npm run setup
```

### 2. Development
```bash
# Edit code locally (hot reload enabled)
# Volumes are mounted for live updates

# Run tests
docker-compose run soroban cargo test
docker-compose run evm forge test
```

### 3. Full Integration Test
```bash
# Start all services
docker-compose up -d

# Run full test suite
docker-compose run circuits bash /scripts/full-test.sh
```

---

## 🧪 Testing

### Run All Tests
```bash
docker-compose run circuits npm test
docker-compose run soroban cargo test
docker-compose run evm forge test
```

### Integration Tests
```bash
docker-compose up -d soroban evm
docker-compose run circuits bash -c "npm run test:integration"
```

---

## 🐛 Debugging

### View Logs
```bash
docker-compose logs -f soroban
docker-compose logs -f evm
docker-compose logs -f web
```

### Enter Container
```bash
docker-compose exec soroban bash
docker-compose exec evm bash
```

### Check Health
```bash
docker-compose ps
docker-compose run soroban bash /scripts/health-check.sh
```

---

## 🗑️ Cleanup

### Stop All Services
```bash
docker-compose down
```

### Remove Volumes (Clean State)
```bash
docker-compose down -v
```

### Rebuild from Scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Resource Usage

### Recommended Resources
- **CPU:** 4+ cores
- **RAM:** 8GB minimum, 16GB recommended
- **Disk:** 20GB for images and volumes

### Monitor Usage
```bash
docker stats
```

---

## 🔗 Related Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Development Guide](../docs/getting-started/DEVELOPMENT.md)

---

**Status:** 🚧 Structure created - Dockerfiles and compose implementation in progress
