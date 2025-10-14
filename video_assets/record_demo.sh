#!/bin/bash

################################################################################
# OpenZKTool - Automated Demo Script for Video Recording
#
# This script provides a beautiful, automated demonstration of OpenZKTool's
# multi-chain ZK proof verification capabilities.
#
# Usage:
#   bash record_demo.sh              # Normal speed
#   FAST=1 bash record_demo.sh       # Faster for quick testing
#   DEMO_AUTO=1 bash record_demo.sh  # Auto-play (no pauses)
#
# Author: Fernando Boiero
# Project: OpenZKTool (Stellar Privacy PoC)
################################################################################

set -e

# ============================================================================
# Configuration
# ============================================================================

# Speed control
if [ "$FAST" = "1" ]; then
    DELAY_SHORT=0.3
    DELAY_MEDIUM=0.6
    DELAY_LONG=1
    DELAY_TYPING=0.02
else
    DELAY_SHORT=1
    DELAY_MEDIUM=2
    DELAY_LONG=3
    DELAY_TYPING=0.05
fi

# Auto-play mode (no pauses)
AUTO_MODE="${DEMO_AUTO:-0}"

# Colors
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'
ITALIC='\033[3m'

# Foreground colors
BLACK='\033[30m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
WHITE='\033[37m'

# Bright colors
BRIGHT_BLACK='\033[90m'
BRIGHT_RED='\033[91m'
BRIGHT_GREEN='\033[92m'
BRIGHT_YELLOW='\033[93m'
BRIGHT_BLUE='\033[94m'
BRIGHT_MAGENTA='\033[95m'
BRIGHT_CYAN='\033[96m'
BRIGHT_WHITE='\033[97m'

# Background colors
BG_PURPLE='\033[48;5;93m'
BG_BLUE='\033[48;5;33m'
BG_GREEN='\033[48;5;35m'

# Custom colors matching website
PURPLE='\033[38;5;141m'     # #7B61FF
BLUE_CYAN='\033[38;5;45m'   # #00D1FF
ZK_GREEN='\033[38;5;48m'    # #00FF94

# Icons
LOCK="🔐"
CHAIN="⛓️"
STAR="🌟"
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
CLOCK="⏱️"
SHIELD="🛡️"
BRAIN="🧠"
SPARKLES="✨"
GEAR="⚙️"
DOCUMENT="📄"
PARTY="🎉"

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    clear
    echo -e "${BOLD}${PURPLE}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "  ${LOCK} OpenZKTool - Multi-Chain Zero-Knowledge Proof Toolkit"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RESET}"
    echo -e "${DIM}Privacy-Preserving Identity | Production-Grade Performance${RESET}"
    echo -e "${DIM}Ethereum + Stellar Soroban | Open Source (AGPL-3.0)${RESET}"
    echo ""
}

print_section() {
    local title="$1"
    local icon="$2"
    echo ""
    echo -e "${BOLD}${BLUE_CYAN}${icon} ${title}${RESET}"
    echo -e "${DIM}$(printf '─%.0s' {1..70})${RESET}"
    echo ""
}

print_step() {
    local step="$1"
    local desc="$2"
    echo -e "${BRIGHT_WHITE}${BOLD}Step ${step}:${RESET} ${desc}"
    sleep "$DELAY_SHORT"
}

print_info() {
    local msg="$1"
    echo -e "${BRIGHT_CYAN}ℹ${RESET}  ${msg}"
}

print_success() {
    local msg="$1"
    echo -e "${ZK_GREEN}${CHECK}${RESET} ${BOLD}${msg}${RESET}"
}

print_error() {
    local msg="$1"
    echo -e "${RED}${CROSS}${RESET} ${msg}"
}

print_warning() {
    local msg="$1"
    echo -e "${YELLOW}⚠${RESET}  ${msg}"
}

simulate_typing() {
    local text="$1"
    local delay="${2:-$DELAY_TYPING}"

    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep "$delay"
    done
    echo ""
}

print_code_block() {
    local content="$1"
    echo -e "${DIM}┌────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${DIM}│${RESET} ${content}"
    echo -e "${DIM}└────────────────────────────────────────────────────────────┘${RESET}"
}

pause_demo() {
    if [ "$AUTO_MODE" != "1" ]; then
        echo ""
        echo -e "${DIM}Press [ENTER] to continue...${RESET}"
        read -r
    else
        sleep "$DELAY_LONG"
    fi
}

show_progress() {
    local duration="$1"
    local steps=20
    local delay=$(echo "scale=2; $duration / $steps" | bc)

    echo -n "["
    for ((i=0; i<steps; i++)); do
        echo -n "▓"
        sleep "$delay"
    done
    echo "] Done!"
}

# ============================================================================
# Demo Scenarios
# ============================================================================

show_scenario() {
    print_section "Real-World Use Case: Alice's KYC Verification" "👤"

    echo -e "${BRIGHT_WHITE}Scenario:${RESET}"
    echo "  Alice wants to access a financial service that requires:"
    echo "    • Age ≥ 18 years"
    echo "    • Balance ≥ \$50"
    echo "    • Country is allowed"
    echo ""

    echo -e "${BRIGHT_WHITE}Alice's Private Data:${RESET}"
    echo -e "  ${DIM}(She ${BOLD}${RED}does NOT${RESET}${DIM} want to reveal this!)${RESET}"
    echo "    • Age: 25 years old"
    echo "    • Balance: \$150.00"
    echo "    • Country: Argentina (code: 32)"
    echo ""

    echo -e "${BRIGHT_WHITE}Challenge:${RESET}"
    echo "  How can Alice prove she meets the requirements"
    echo "  WITHOUT revealing her exact age, balance, or country?"
    echo ""

    sleep "$DELAY_MEDIUM"

    echo -e "${ZK_GREEN}${BRAIN} Solution: Zero-Knowledge Proofs!${RESET}"
    echo ""

    pause_demo
}

# ============================================================================
# Circuit Compilation
# ============================================================================

simulate_circuit_compilation() {
    print_section "Phase 1: Circuit Compilation" "${GEAR}"

    print_step "1" "Compiling Circom circuit..."
    echo ""

    echo -e "${DIM}\$ circom kyc_transfer.circom --r1cs --wasm --sym${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  Compiling circuit..." 0.03
    show_progress 2

    echo ""
    print_info "Circuit compiled successfully"
    print_code_block "  ${ZK_GREEN}✓${RESET} R1CS constraints: ${BOLD}586${RESET}"
    print_code_block "  ${ZK_GREEN}✓${RESET} WASM witness generator created"
    print_code_block "  ${ZK_GREEN}✓${RESET} Symbols table generated"

    sleep "$DELAY_MEDIUM"

    print_step "2" "Performing trusted setup (Powers of Tau)..."
    echo ""

    simulate_typing "  Generating random entropy..." 0.02
    show_progress 1.5

    echo ""
    print_info "Trusted setup complete"
    print_code_block "  ${ZK_GREEN}✓${RESET} Proving key: ${BOLD}kyc_transfer_final.zkey${RESET} (3.2 MB)"
    print_code_block "  ${ZK_GREEN}✓${RESET} Verification key: ${BOLD}kyc_transfer_vkey.json${RESET}"

    echo ""
    print_success "Circuit ready for proof generation"

    pause_demo
}

# ============================================================================
# Proof Generation
# ============================================================================

simulate_proof_generation() {
    print_section "Phase 2: Proof Generation" "${LOCK}"

    print_step "1" "Alice prepares her private inputs..."
    echo ""

    cat << EOF
${DIM}// input.json${RESET}
{
  ${DIM}// Private inputs (hidden from verifier)${RESET}
  "age": 25,              ${DIM}// Alice is 25 years old${RESET}
  "balance": 150,         ${DIM}// She has \$150${RESET}
  "countryId": 32,        ${DIM}// Argentina${RESET}

  ${DIM}// Public parameters (visible to verifier)${RESET}
  "minAge": 18,           ${DIM}// Requirement: age ≥ 18${RESET}
  "minBalance": 50,       ${DIM}// Requirement: balance ≥ \$50${RESET}
  "allowedCountries": [32, 1, 5]  ${DIM}// Allowed countries${RESET}
}
EOF

    sleep "$DELAY_LONG"

    echo ""
    print_step "2" "Generating Zero-Knowledge Proof..."
    echo ""

    echo -e "${DIM}\$ snarkjs groth16 fullprove input.json kyc_transfer.wasm kyc_transfer_final.zkey${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${SHIELD} Computing witness..." 0.03
    sleep 0.3
    simulate_typing "  ${BRAIN} Generating proof..." 0.03
    show_progress 1

    echo ""
    print_success "Proof generated in ${BOLD}872ms${RESET}"

    echo ""
    print_code_block "  ${DOCUMENT} Proof size: ${BOLD}${ZK_GREEN}~800 bytes${RESET}"
    print_code_block "  ${DOCUMENT} Public output: ${BOLD}kycValid = 1${RESET} ${DIM}(eligible!)${RESET}"

    echo ""
    echo -e "${BRIGHT_WHITE}${BOLD}What the proof contains:${RESET}"
    echo "  ${ZK_GREEN}✓${RESET} Cryptographic commitment that Alice meets ALL requirements"
    echo "  ${RED}✗${RESET} Does NOT contain Alice's actual age (25)"
    echo "  ${RED}✗${RESET} Does NOT contain Alice's actual balance (\$150)"
    echo "  ${RED}✗${RESET} Does NOT contain Alice's actual country (Argentina)"
    echo ""

    echo -e "${DIM}${ITALIC}\"Alice can now prove she's eligible without revealing her personal data!\"${RESET}"

    pause_demo
}

# ============================================================================
# Local Verification
# ============================================================================

simulate_local_verification() {
    print_section "Phase 3: Local Verification (Off-Chain)" "${CHECK}"

    print_step "1" "Verifying proof locally..."
    echo ""

    echo -e "${DIM}\$ snarkjs groth16 verify kyc_transfer_vkey.json public.json proof.json${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${BRAIN} Verifying cryptographic proof..." 0.03
    show_progress 0.5

    echo ""
    print_success "Proof is VALID ${PARTY}"

    echo ""
    print_code_block "  ${CLOCK} Verification time: ${BOLD}<50ms${RESET}"
    print_code_block "  ${CHECK} Alice proved: age ≥ 18, balance ≥ \$50, country allowed"
    print_code_block "  ${SHIELD} Without revealing: exact age, balance, or country"

    pause_demo
}

# ============================================================================
# EVM Verification
# ============================================================================

simulate_evm_verification() {
    print_section "Phase 4: On-Chain Verification (Ethereum/EVM)" "${CHAIN}"

    print_step "1" "Deploying Groth16 verifier contract to Ethereum..."
    echo ""

    echo -e "${DIM}\$ forge create Verifier --rpc-url http://localhost:8545${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${GEAR} Compiling Solidity contract..." 0.03
    sleep 0.5
    simulate_typing "  ${ROCKET} Deploying to local testnet (Anvil)..." 0.03
    show_progress 2

    echo ""
    print_success "Contract deployed!"
    print_code_block "  ${CHAIN} Address: ${BOLD}0xabcd1234...${RESET}"
    print_code_block "  ${CHAIN} Network: Ethereum (local testnet)"

    sleep "$DELAY_MEDIUM"

    print_step "2" "Verifying proof on-chain..."
    echo ""

    echo -e "${DIM}\$ forge test --match-test testVerifyProof -vv${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${BRAIN} Calling verifyProof() function..." 0.03
    show_progress 2

    echo ""
    print_success "On-chain verification PASSED ${CHECK}"

    echo ""
    echo -e "${BRIGHT_WHITE}${BOLD}Gas Analysis:${RESET}"
    print_code_block "  ${GEAR} Gas used: ${BOLD}~250,000 gas${RESET}"
    print_code_block "  ${CLOCK} Block time: ${BOLD}2.3 seconds${RESET}"
    print_code_block "  ${ZK_GREEN}✓${RESET} Proof verified on Ethereum!"

    pause_demo
}

# ============================================================================
# Soroban Verification
# ============================================================================

simulate_soroban_verification() {
    print_section "Phase 5: On-Chain Verification (Stellar Soroban)" "${STAR}"

    print_step "1" "Building Soroban contract..."
    echo ""

    echo -e "${DIM}\$ cargo build --target wasm32-unknown-unknown --release${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${GEAR} Compiling Rust contract (no_std)..." 0.03
    show_progress 2

    echo ""
    print_info "Contract optimized for Soroban runtime"
    print_code_block "  ${ZK_GREEN}✓${RESET} Binary size: ${BOLD}~10KB${RESET} (highly optimized)"
    print_code_block "  ${ZK_GREEN}✓${RESET} Implements full BN254 curve arithmetic"
    print_code_block "  ${ZK_GREEN}✓${RESET} Groth16 verification logic included"

    sleep "$DELAY_MEDIUM"

    print_step "2" "Deploying to Stellar Testnet..."
    echo ""

    echo -e "${DIM}\$ soroban contract deploy --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm --network testnet${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${ROCKET} Uploading WASM to Stellar..." 0.03
    show_progress 1.5

    echo ""
    print_success "Contract deployed to Stellar Testnet!"
    print_code_block "  ${STAR} Contract ID: ${BOLD}CBPBVJJW5NMV4UVEDKSR6UO4...${RESET}"
    print_code_block "  ${STAR} Network: Stellar Testnet"
    print_code_block "  ${STAR} Explorer: stellar.expert/explorer/testnet/contract/..."

    sleep "$DELAY_MEDIUM"

    print_step "3" "Verifying the SAME proof on Soroban..."
    echo ""

    echo -e "${DIM}\$ soroban contract invoke --id CBPBVJJW... --fn verify_proof -- --proof <proof_data>${RESET}"
    sleep "$DELAY_SHORT"

    echo ""
    simulate_typing "  ${BRAIN} Calling verify_proof() on Stellar..." 0.03
    show_progress 1.5

    echo ""
    print_success "On-chain verification PASSED ${CHECK}"

    echo ""
    echo -e "${BRIGHT_WHITE}${BOLD}Stellar Performance:${RESET}"
    print_code_block "  ${GEAR} Fee: ${BOLD}~0.00001 XLM${RESET} (much cheaper than EVM)"
    print_code_block "  ${CLOCK} Confirmation: ${BOLD}1.8 seconds${RESET} (faster finality)"
    print_code_block "  ${STAR} Proof verified on Stellar Soroban!"

    pause_demo
}

# ============================================================================
# Multi-Chain Summary
# ============================================================================

show_multichain_summary() {
    print_section "Multi-Chain Interoperability Achieved ${SPARKLES}" "${PARTY}"

    echo -e "${BRIGHT_WHITE}${BOLD}Summary:${RESET}"
    echo ""

    echo -e "${BOLD}Alice's Journey:${RESET}"
    echo "  1. ${ZK_GREEN}✓${RESET} Generated ONE Zero-Knowledge Proof (800 bytes, <1s)"
    echo "  2. ${ZK_GREEN}✓${RESET} Verified locally off-chain (<50ms)"
    echo "  3. ${ZK_GREEN}✓${RESET} Verified on Ethereum (250k gas, 2.3s)"
    echo "  4. ${ZK_GREEN}✓${RESET} Verified on Stellar Soroban (0.00001 XLM, 1.8s)"
    echo ""

    echo -e "${BOLD}${PURPLE}${SPARKLES} ONE PROOF, MULTIPLE BLOCKCHAINS ${SPARKLES}${RESET}"
    echo ""

    echo -e "${BRIGHT_WHITE}${BOLD}What was proven:${RESET}"
    echo "  ${ZK_GREEN}✓${RESET} Alice is ≥ 18 years old"
    echo "  ${ZK_GREEN}✓${RESET} Alice has ≥ \$50 balance"
    echo "  ${ZK_GREEN}✓${RESET} Alice is from an allowed country"
    echo ""

    echo -e "${BRIGHT_WHITE}${BOLD}What was NOT revealed:${RESET}"
    echo "  ${RED}✗${RESET} Exact age (25)"
    echo "  ${RED}✗${RESET} Exact balance (\$150)"
    echo "  ${RED}✗${RESET} Exact country (Argentina)"
    echo ""

    echo -e "${DIM}${ITALIC}\"Privacy and compliance, working together.\"${RESET}"

    sleep "$DELAY_LONG"
    pause_demo
}

# ============================================================================
# Technical Details
# ============================================================================

show_technical_details() {
    print_section "Technical Details" "${BRAIN}"

    cat << EOF
${BOLD}Circuit Architecture:${RESET}
  • Algorithm: ${BOLD}Groth16 SNARK${RESET}
  • Curve: ${BOLD}BN254 (alt_bn128)${RESET}
  • Constraints: ${BOLD}586${RESET} (highly efficient)
  • Proof size: ${BOLD}~800 bytes${RESET}
  • Generation time: ${BOLD}<1 second${RESET}
  • Verification time: ${BOLD}<50ms${RESET} (off-chain)

${BOLD}Multi-Chain Support:${RESET}
  ${CHAIN} ${BOLD}Ethereum/EVM:${RESET}
    - Solidity verifier contract
    - Gas cost: ~250,000 gas
    - Compatible: Polygon, BSC, Arbitrum, Optimism, Base

  ${STAR} ${BOLD}Stellar Soroban:${RESET}
    - Rust no_std verifier contract
    - Fee: ~0.00001 XLM
    - Full BN254 cryptographic implementation
    - 10KB optimized WASM binary

${BOLD}Privacy Guarantees:${RESET}
  ${SHIELD} Zero-Knowledge: Prover reveals nothing beyond the statement
  ${SHIELD} Soundness: Impossible to forge a false proof (cryptographic security)
  ${SHIELD} Completeness: Valid proofs always verify

${BOLD}Use Cases:${RESET}
  • Private identity verification (KYC/AML)
  • Solvency proofs (without revealing balance)
  • Age verification (without revealing birthdate)
  • Country compliance (without revealing location)
  • Private voting and governance
  • Confidential transactions

EOF

    pause_demo
}

# ============================================================================
# Call to Action
# ============================================================================

show_call_to_action() {
    print_section "Get Started with OpenZKTool" "${ROCKET}"

    echo -e "${BOLD}${BRIGHT_WHITE}OpenZKTool is free, open source, and ready to use!${RESET}"
    echo ""

    echo -e "${BOLD}Quick Start:${RESET}"
    echo -e "  ${DIM}\$${RESET} git clone https://github.com/xcapit/stellar-privacy-poc.git"
    echo -e "  ${DIM}\$${RESET} cd stellar-privacy-poc"
    echo -e "  ${DIM}\$${RESET} npm install"
    echo -e "  ${DIM}\$${RESET} npm test          ${DIM}# Run complete test suite${RESET}"
    echo ""

    echo -e "${BOLD}Resources:${RESET}"
    echo "  🌐 Website: ${BLUE_CYAN}https://openzktool.vercel.app${RESET}"
    echo "  📖 Docs: ${BLUE_CYAN}https://github.com/xcapit/stellar-privacy-poc/blob/main/README.md${RESET}"
    echo "  💬 GitHub: ${BLUE_CYAN}https://github.com/xcapit/stellar-privacy-poc${RESET}"
    echo ""

    echo -e "${BOLD}Project Status:${RESET}"
    echo "  ${ZK_GREEN}✅${RESET} PoC Complete (Phase 0)"
    echo "  ${YELLOW}🚧${RESET} MVP in Progress (Phase 1)"
    echo "  ${YELLOW}🧭${RESET} Testnet Planned (Phase 2)"
    echo "  ${YELLOW}🌐${RESET} Mainnet Future (Phase 3)"
    echo ""

    echo -e "${BOLD}License & Compliance:${RESET}"
    echo "  ${ZK_GREEN}🔓${RESET} Open Source: ${BOLD}AGPL-3.0-or-later${RESET}"
    echo "  ${ZK_GREEN}🌍${RESET} Digital Public Good (DPG compliance)"
    echo "  ${ZK_GREEN}🎓${RESET} Academic partnerships: UTN FRVM Blockchain Lab"
    echo ""

    sleep "$DELAY_LONG"

    echo ""
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${BOLD}${PURPLE}  ${LOCK} OpenZKTool: Zero-Knowledge Proofs Made Easy ${SPARKLES}${RESET}"
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    echo -e "${DIM}${ITALIC}Prove without revealing. Build private dApps. Multi-chain ready.${RESET}"
    echo ""
}

# ============================================================================
# Main Demo Flow
# ============================================================================

main() {
    print_header

    echo -e "${BOLD}${BRIGHT_WHITE}Welcome to the OpenZKTool Demo!${RESET}"
    echo ""
    echo "This demonstration will show you:"
    echo "  • How Zero-Knowledge Proofs protect privacy"
    echo "  • Multi-chain verification (Ethereum + Stellar)"
    echo "  • Production-grade performance metrics"
    echo "  • Real-world use case: Private KYC verification"
    echo ""

    if [ "$AUTO_MODE" != "1" ]; then
        echo -e "${DIM}Press [ENTER] to begin...${RESET}"
        read -r
    else
        sleep "$DELAY_LONG"
    fi

    # Demo flow
    show_scenario
    simulate_circuit_compilation
    simulate_proof_generation
    simulate_local_verification
    simulate_evm_verification
    simulate_soroban_verification
    show_multichain_summary
    show_technical_details
    show_call_to_action

    echo -e "${ZK_GREEN}${PARTY} Demo complete! Thank you for watching! ${PARTY}${RESET}"
    echo ""
}

# ============================================================================
# Run Demo
# ============================================================================

main "$@"
