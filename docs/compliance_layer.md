# Compliance Layer Specification

Architecture and implementation details for regulatory compliance features in OpenZKTool.

## Problem Statement

Zero-Knowledge Proofs provide strong privacy guarantees, but financial applications require regulatory oversight. The compliance layer bridges this gap by enabling selective disclosure to authorized auditors while maintaining public privacy.

## Design Goals

1. **Selective disclosure** - Reveal private data only to authorized parties
2. **Audit trails** - Log all verifications for regulatory review
3. **Jurisdictional compliance** - Support different regulatory frameworks
4. **Non-repudiation** - Cryptographic proof of audit events
5. **Minimal trust** - Reduce reliance on centralized parties

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                    User Application                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Compliance Layer API                    │
│  • Disclosure manager                                   │
│  • Audit logger                                         │
│  • Access control                                       │
└────────────┬──────────────────────┬─────────────────────┘
             │                      │
             ▼                      ▼
┌────────────────────┐    ┌─────────────────────────────┐
│   Disclosure DB    │    │   Audit Log (Blockchain)    │
│   (Encrypted)      │    │   • Verification events     │
│   • User consent   │    │   • Disclosure events       │
│   • Private data   │    │   • Auditor access          │
└────────────────────┘    └─────────────────────────────┘
```

### Data Flow

1. **User generates proof** with compliance metadata
2. **Proof verified on-chain** - Public verification
3. **Compliance data stored** - Encrypted, user-controlled
4. **Auditor requests disclosure** - With proper authorization
5. **User approves disclosure** - Explicit consent
6. **Private data revealed** - Only to specific auditor
7. **Audit event logged** - Immutable record on-chain

## Implementation Phases

### Phase 1: Basic Logging (Months 1-2)

**Goal:** Record all verification events

**Components:**
- Smart contract event emissions
- Off-chain event indexer
- Basic query API

**Features:**
- Log all proof verifications
- Store proof hash and timestamp
- Track verification outcomes
- Public verification history

**Smart Contract Addition:**
```solidity
event ProofVerified(
    bytes32 indexed proofHash,
    address indexed submitter,
    uint256 timestamp,
    bool result
);

function verifyProofWithLogging(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input
) public returns (bool) {
    bool result = verifyProof(a, b, c, input);
    bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, input));
    emit ProofVerified(proofHash, msg.sender, block.timestamp, result);
    return result;
}
```

**Query API:**
```typescript
interface AuditLog {
  proofHash: string;
  submitter: string;
  timestamp: number;
  result: boolean;
}

async function getVerificationHistory(address: string): Promise<AuditLog[]> {
  // Query blockchain events
  const events = await contract.queryFilter(
    contract.filters.ProofVerified(null, address)
  );
  return events.map(e => ({
    proofHash: e.args.proofHash,
    submitter: e.args.submitter,
    timestamp: e.args.timestamp.toNumber(),
    result: e.args.result
  }));
}
```

### Phase 2: Selective Disclosure (Months 3-4)

**Goal:** Enable authorized data access

**Components:**
- Encrypted data storage
- Access control system
- Disclosure API
- User consent management

**Features:**
- Encrypt private inputs with user key
- Store encrypted data off-chain (IPFS/private storage)
- Access control via smart contract
- User-controlled disclosure permissions
- Auditor authentication

**Encryption Schema:**
```typescript
interface DisclosurePackage {
  proofHash: string;
  encryptedData: string;  // AES-256 encrypted private inputs
  dataHash: string;       // Hash to verify integrity
  userPublicKey: string;  // For encryption
  timestamp: number;
  jurisdiction: string;   // Regulatory context
}

// Encrypt private data with user key
async function createDisclosurePackage(
  privateInputs: CircuitInputs,
  userKey: string,
  proofHash: string
): Promise<DisclosurePackage> {
  const dataString = JSON.stringify(privateInputs);
  const encryptedData = await encrypt(dataString, userKey);
  const dataHash = hash(dataString);

  return {
    proofHash,
    encryptedData,
    dataHash,
    userPublicKey: derivePublicKey(userKey),
    timestamp: Date.now(),
    jurisdiction: 'US' // Or from config
  };
}
```

**Access Control Contract:**
```solidity
contract DisclosureManager {
    // Mapping: proofHash => auditor => authorized
    mapping(bytes32 => mapping(address => bool)) public disclosureAuthorizations;

    // Mapping: auditor => verified
    mapping(address => bool) public verifiedAuditors;

    event DisclosureAuthorized(
        bytes32 indexed proofHash,
        address indexed auditor,
        uint256 timestamp
    );

    event DisclosureRevoked(
        bytes32 indexed proofHash,
        address indexed auditor,
        uint256 timestamp
    );

    // User authorizes auditor to access specific proof data
    function authorizeDisclosure(
        bytes32 proofHash,
        address auditor
    ) external {
        require(verifiedAuditors[auditor], "Auditor not verified");
        disclosureAuthorizations[proofHash][auditor] = true;
        emit DisclosureAuthorized(proofHash, auditor, block.timestamp);
    }

    // User revokes authorization
    function revokeDisclosure(
        bytes32 proofHash,
        address auditor
    ) external {
        disclosureAuthorizations[proofHash][auditor] = false;
        emit DisclosureRevoked(proofHash, auditor, block.timestamp);
    }

    // Check if auditor is authorized
    function isAuthorized(
        bytes32 proofHash,
        address auditor
    ) external view returns (bool) {
        return disclosureAuthorizations[proofHash][auditor];
    }

    // Admin function to verify auditors
    function verifyAuditor(address auditor) external onlyAdmin {
        verifiedAuditors[auditor] = true;
    }
}
```

**Disclosure API:**
```typescript
// Auditor requests disclosure
async function requestDisclosure(
  proofHash: string,
  auditorAddress: string,
  reason: string
): Promise<string> {
  // Submit request on-chain
  const tx = await disclosureManager.requestDisclosure(
    proofHash,
    auditorAddress,
    reason
  );
  await tx.wait();

  // Notify user (off-chain)
  await notifyUser(proofHash, auditorAddress, reason);

  return tx.hash;
}

// User approves disclosure
async function approveDisclosure(
  proofHash: string,
  auditorAddress: string,
  userKey: string
): Promise<void> {
  // Authorize on-chain
  await disclosureManager.authorizeDisclosure(proofHash, auditorAddress);

  // Decrypt and re-encrypt data for auditor
  const package = await getDisclosurePackage(proofHash);
  const decrypted = await decrypt(package.encryptedData, userKey);
  const auditorPublicKey = await getAuditorPublicKey(auditorAddress);
  const reencrypted = await encrypt(decrypted, auditorPublicKey);

  // Store for auditor access
  await storeForAuditor(proofHash, auditorAddress, reencrypted);
}

// Auditor retrieves disclosed data
async function getDisclosedData(
  proofHash: string,
  auditorKey: string
): Promise<CircuitInputs> {
  // Check authorization
  const authorized = await disclosureManager.isAuthorized(
    proofHash,
    auditorAddress
  );
  if (!authorized) throw new Error('Not authorized');

  // Retrieve encrypted data
  const encryptedData = await retrieveAuditorData(proofHash, auditorAddress);

  // Decrypt with auditor key
  const decrypted = await decrypt(encryptedData, auditorKey);

  return JSON.parse(decrypted);
}
```

### Phase 3: Compliance Dashboard (Months 5-6)

**Goal:** User interface for compliance management

**Components:**
- Web dashboard for users
- Auditor portal
- Admin panel for regulators
- Analytics and reporting

**Features:**

**User Dashboard:**
- View all verification history
- Manage disclosure permissions
- Respond to auditor requests
- Export compliance reports
- Revoke access

**Auditor Portal:**
- Request data disclosure
- View authorized disclosures
- Download disclosed data
- Submit audit reports
- Track compliance status

**Admin/Regulator Panel:**
- Register verified auditors
- Monitor system activity
- Generate reports
- Set compliance policies
- Resolve disputes

**Dashboard API:**
```typescript
interface ComplianceDashboard {
  // User functions
  getUserVerifications(address: string): Promise<Verification[]>;
  getPendingDisclosures(address: string): Promise<DisclosureRequest[]>;
  approveDisclosure(proofHash: string, auditor: string): Promise<void>;
  revokeDisclosure(proofHash: string, auditor: string): Promise<void>;
  exportReport(address: string, format: 'pdf' | 'csv'): Promise<Buffer>;

  // Auditor functions
  requestDisclosure(proofHash: string, reason: string): Promise<string>;
  getAuthorizedDisclosures(auditor: string): Promise<Disclosure[]>;
  downloadDisclosedData(proofHash: string): Promise<CircuitInputs>;
  submitAuditReport(proofHash: string, report: AuditReport): Promise<void>;

  // Admin functions
  registerAuditor(address: string, credentials: Credentials): Promise<void>;
  getSystemStats(): Promise<ComplianceStats>;
  generateComplianceReport(period: DateRange): Promise<Report>;
}
```

## Technical Specifications

### Encryption

**Algorithm:** AES-256-GCM
**Key derivation:** HKDF with SHA-256
**User keys:** Derived from wallet signature
**Auditor keys:** Generated and stored securely

**Key exchange:**
```typescript
// User generates ephemeral key from wallet
async function deriveUserKey(wallet: Wallet): Promise<string> {
  const message = "OpenZKTool Compliance Key";
  const signature = await wallet.signMessage(message);
  return hkdf(signature, 'compliance-encryption');
}

// Encrypt with hybrid scheme (ECDH + AES)
async function encryptForRecipient(
  data: string,
  recipientPublicKey: string
): Promise<string> {
  const ephemeralKey = generateECDHKey();
  const sharedSecret = ecdh(ephemeralKey, recipientPublicKey);
  const aesKey = kdf(sharedSecret);
  return aes256gcm.encrypt(data, aesKey);
}
```

### Storage

**Private data storage:**
- IPFS for decentralized storage
- Encrypted before upload
- Content-addressed (CID as reference)
- Pinned by user and auditors

**Audit log storage:**
- Ethereum/Stellar events
- Indexed by The Graph or similar
- Queryable via GraphQL
- Archived for regulatory retention

**Retention policy:**
- Keep logs for regulatory requirement period (typically 7 years)
- User can request deletion after period
- Auditors must archive disclosed data

### Access Control

**User permissions:**
- Owns all private data
- Grants/revokes auditor access
- Can export all compliance data
- Can delete after retention period

**Auditor permissions:**
- Request disclosure with justification
- Access authorized data only
- Cannot modify or delete logs
- Must maintain confidentiality

**Admin permissions:**
- Verify auditor credentials
- View aggregate statistics (no private data)
- Enforce compliance policies
- Cannot access private data without user consent

## Security Considerations

### Threat Model

**Threats:**
1. Unauthorized auditor impersonation
2. User key compromise
3. Auditor key leakage
4. MITM attacks on disclosure
5. Storage provider breach
6. Smart contract vulnerabilities

**Mitigations:**
1. On-chain auditor registry with verification
2. Hardware wallet support, key rotation
3. Auditor key in HSM, regular rotation
4. End-to-end encryption, signature verification
5. Encryption at rest, zero-knowledge storage
6. Security audits, formal verification

### Privacy Guarantees

**What remains private:**
- All circuit inputs (age, balance, etc.)
- Proof generation metadata
- User identity (unless disclosed)
- Transaction patterns (with mixing)

**What is public:**
- Proof verification events
- Timestamps
- Verification outcomes (valid/invalid)
- Auditor addresses (for transparency)

**What can be disclosed:**
- Private inputs (with user consent)
- Proof generation details
- User identity verification
- Transaction context

### Compliance Standards

**Supported frameworks:**
- GDPR (EU) - Right to access, deletion, portability
- CCPA (California) - Consumer data rights
- AML/KYC (Global) - Identity verification, monitoring
- FATF Travel Rule - Transaction information sharing
- MiCA (EU) - Crypto asset regulation

**Implementation checklist:**
- [ ] Data subject rights (access, deletion, portability)
- [ ] Lawful basis for processing (consent, legal obligation)
- [ ] Data minimization (only necessary data)
- [ ] Purpose limitation (specific use cases)
- [ ] Storage limitation (retention policies)
- [ ] Security measures (encryption, access control)
- [ ] Accountability (audit logs, reports)

## Integration Examples

### Basic Integration

```typescript
import { ComplianceManager } from '@openzktool/compliance';

// Initialize compliance manager
const compliance = new ComplianceManager({
  network: 'ethereum',
  contractAddress: '0x...',
  storageProvider: 'ipfs'
});

// Generate proof with compliance metadata
const { proof, publicSignals } = await prover.prove(privateInputs);

// Store compliance data
await compliance.storeDisclosurePackage({
  proofHash: hash(proof),
  privateInputs,
  userAddress: wallet.address,
  jurisdiction: 'US'
});

// Verify on-chain with logging
const tx = await compliance.verifyWithLogging(proof, publicSignals);
await tx.wait();

// Later: User approves auditor disclosure
await compliance.authorizeAuditor(proofHash, auditorAddress);
```

### Advanced: Jurisdiction-Specific Compliance

```typescript
// Configure for specific jurisdiction
const complianceEU = new ComplianceManager({
  jurisdiction: 'EU',
  regulations: ['GDPR', 'MiCA'],
  dataResidency: 'EU',
  retentionPeriod: 7 * 365 * 24 * 60 * 60 // 7 years
});

// Generate compliance report
const report = await complianceEU.generateReport({
  user: userAddress,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'pdf',
  language: 'en'
});
```

## Roadmap Alignment

See [ROADMAP.md](../ROADMAP.md) for timeline:

- **Phase 1** (Months 1-2): Basic event logging
- **Phase 2** (Months 3-4): Selective disclosure implementation
- **Phase 3** (Months 5-6): Dashboard and production readiness

## Open Questions

1. **Decentralization:** How to verify auditors without central authority?
2. **Key recovery:** User loses key - how to access encrypted data?
3. **Cross-chain:** Disclosure permissions across multiple chains?
4. **Scalability:** Audit log storage for millions of users?
5. **Conflicts:** User refuses disclosure required by law?

These will be addressed during implementation phases.

## References

- GDPR: https://gdpr.eu/
- CCPA: https://oag.ca.gov/privacy/ccpa
- FATF Travel Rule: https://www.fatf-gafi.org/
- MiCA: https://www.esma.europa.eu/policy-activities/crypto-assets
- Zero-Knowledge Compliance: https://eprint.iacr.org/2023/XXXX

## Contributing

This specification is evolving. Feedback welcome via:
- GitHub Issues
- Community Discord
- Email: compliance@openzktool.dev

---

**Version:** 1.0 (Draft)
**Last updated:** 2025-01-15
**Status:** Specification - Implementation pending
