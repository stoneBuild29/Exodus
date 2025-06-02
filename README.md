# Exodus · A Decentralized Life & Legacy Protocol

![图片描述](https://github.com/stoneBuild29/picx-images-hosting/raw/master/CleanShot-2025-06-02-at-02.22.31.6pnr2qoics.gif)

Live Demo → https://blue-caribou-kelsey-5edrnlbe.bls.dev

Exodus is an end-to-end decentralized system designed to monitor patient life signals, generate personalized risk inference, and automatically execute digital wills upon verified death. It is implemented as a modular prototype on Bless Network, combining off-chain AI logic with on-chain verifiability, mimicking a trustless Nakamoto-style chain. The system demonstrates how sensitive health and legacy data can be processed and acted upon under verifiable, decentralized assumptions.

---

## System Architecture

### 1. Continuous Health Data Aggregation

User health data — including IoT device readings, hospital records, and family medical history — is automatically aggregated into a personalized health profile (PatientCluster) through decentralized storage on the Bless Network. The PatientCluster is a personalized, evolving dataset that aggregates a user's health-related information for AI-driven inference. It begins with core data from the individual — such as IoT device signals, hospital records, and family medical history — and expands by incorporating relevant external data.

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

### 4. Decentralized Blockchain (NakamotoChain)

A custom lightweight blockchain provides tamper-proof infrastructure:

| Feature            | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| Proof-of-Work      | Simulated Bitcoin-style consensus for securing integrity    |
| Will Transaction   | Special transaction type carrying IPFS hash and metadata    |
| Death Confirmation | Multi-signature event verification (e.g. 3 of 4 validators) |
| Immutable Record   | Once recorded, cannot be changed or deleted                 |

This ensures that once a death is confirmed and will is released, all data is immutable and verifiable on-chain.

---

## Working Flow

1. **Smart Monitor & Data Collection** → via Bless endpoints
   Different kinds of personal health data will be collected. The data includes the following aspects: real-time data from smart smart wearable Devices, family pedigree and medical history, monitoring data during medical care and etc. All this will make up a clear personal health images
2. **PatientCluster Formation** → personal + analogical data
   Data Center of institutions and schools will deploye endpoints on **BLESS NETWORK**. From the specific permissions, relevant data and available data could be fetched and used. The standard is dynamically changing, for example, the group born in the same age, the specific one live from the same disease and so on. The acquired data will be gather into a PatientCluster around on the real circumstance of the patient.
3. **AI Inference** → modular risk and survival analysis
    In the InferencePipeline, health data from the user's PatientCluster is analyzed across key factors such as genetics, lifestyle, and population models. Each factor is processed independently with adaptive weights based on real-time data and historical patterns. Partial results are then aggregated to produce personalized survival probabilities and risk assessments.
4. **Event Monitoring** → AI-BOT tracks health status
    Once a predefined health event (such as high risk event) is detected, the Proceed of Will is activated. Users' wills are pre-registered via smart contracts and stored on IPFS. Death is confirmed by an AI-BOT through multi-source validation — including hospital records, IoT inactivity, and family confirmation.Upon confirmation, the smart contract is triggered.
5. **Smart Contract Execution** → will is distributed via blockchain
     The encrypted will is retrieved and made accessible to authorized beneficiaries using private keys. This ensures secure, decentralized, and tamper-proof post-life asset execution.