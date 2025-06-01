# Exodus · A Decentralized Life & Legacy Protocol

![图片描述](https://github.com/stoneBuild29/picx-images-hosting/raw/master/CleanShot-2025-06-02-at-02.22.31.6pnr2qoics.gif)

Live Demo → https://blue-caribou-kelsey-5edrnlbe.bls.dev

Exodus is an end-to-end decentralized system designed to monitor patient life signals, generate personalized risk inference, and automatically execute digital wills upon verified death. It is implemented as a modular prototype on Bless Network, combining off-chain AI logic with on-chain verifiability, mimicking a trustless Nakamoto-style chain. The system demonstrates how sensitive health and legacy data can be processed and acted upon under verifiable, decentralized assumptions.

---

## System Architecture

### 1. Decentralized Blockchain (NakamotoChain)

| Feature            | Description                                             |
| ------------------ | ------------------------------------------------------- |
| Proof-of-Work      | Secures the network (Bitcoin-style PoW simulation)      |
| Will Transaction   | Special transactions carry IPFS hash + metadata         |
| Death Confirmation | Multi-signature (3/4 threshold) event trigger           |
| Immutable Record   | Once written, wills and confirmations cannot be changed |

---

### 2. Personalized Inference Engine

This component builds upon the previously established PatientCluster, a personalized dataset aggregated from various sources. The engine dynamically adjusts the weights of different data sources based on each patient's profile to perform risk evaluation and survival probability estimation.

**Design Approach:**
Define Inference Factors
Establish the core inference factors (e.g., genetic risk, lifestyle data, population model) and corresponding weighting strategies.

**Dynamic Weight Calculation:**
For each patient, dynamically compute weights for each factor based on their unique data — including IoT device signals, family medical history, and cohort patterns.

**Modular Inference Pipeline:**
Construct an extensible pipeline (InferencePipeline), where each stage processes a specific factor and contributes to partial inference results.

**Result Aggregation:**
Aggregate the outputs from all stages to generate a final risk assessment and survival probability tailored to the patient.

---

### 3. Events Execution Chain

**Will Registration**
Users register their will on-chain using a smart contract. The will is encrypted and stored on IPFS; only the hash is recorded on the blockchain.

**Death Verification**
An AI-BOT continuously monitors the patient's medical records and device activity. Death is confirmed only after multi-source validation (e.g. hospital records, inactivity, family confirmation).

**Will Execution**
Once confirmed, the AI-BOT triggers the smart contract. The encrypted will is released via IPFS, and beneficiaries can decrypt it with their private keys.

---

### 4. 🔐 Security & Privacy

| Feature            | Implementation                                  |
| ------------------ | ----------------------------------------------- |
| Will Content       | Encrypted (AES-256), stored on IPFS             |
| Beneficiary Access | Private key required for decryption             |
| Trigger Authority  | `onlyVerifiedAI` modifier / DAO multisig      |
| Transparency       | All actions recorded on-chain with auditability |

---

## Working Flow

**Continuous Health Data Aggregation**
User health data — including IoT device readings, hospital records, and family medical history — is automatically aggregated into a personalized health profile (PatientCluster) through decentralized storage on the Bless Network.

**Real-Time Vital Monitoring**
An embedded AI-BOT continuously monitors vital signs (e.g., heart rate, activity levels) and cross-references them with external medical data to detect potential risks.

**Multi-Source Death Verification**
When abnormal patterns are detected, the system initiates a multi-source verification process. Confirmation is based on inputs from hospitals, government registries, family confirmation, and prolonged device inactivity — requiring consensus before declaring death.

**Smart Contract–Triggered Will Distribution**
Once death is confirmed, the AI-BOT automatically triggers a smart contract to distribute the encrypted will stored on IPFS to designated beneficiaries. The process is fully autonomous and tamper-proof.
