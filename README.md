Decentralized Event Ticketing DApp

This repository contains the code for a Decentralized Event Ticketing DApp built on Solana. Tickets are issued as NFTs to prevent scalping and fraud. The project uses Rust for the smart contract (on-chain program) and React for the frontend.

 Table of Contents
1. Features
2. Prerequisites
3. Installation
4. Deployment Instructions
5. Contribution Guidelines
6. License
7. Web3Dev


 Features
- Event Creation: Organizers can create events and mint a limited number of NFT tickets.
- Ticket Purchase: Users can purchase tickets (as NFTs) using SOL or another cryptocurrency.
- Prevent Scalping: Tickets are non-transferable or transferable only under specific conditions.
- Fraud Prevention: Tickets are immutable and verifiable on the blockchain.
- Frontend Integration: A user-friendly interface for organizers and attendees.


 Prerequisites
Before you begin, ensure you have the following installed:
- Rust: Install from [https://www.rust-lang.org/](https://www.rust-lang.org/).
- Solana CLI: Install from [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools).
- Anchor Framework: Install using:
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
  ```
- Node.js and npm: Install from [https://nodejs.org/](https://nodejs.org/).
- Git: Install from [https://git-scm.com/](https://git-scm.com/).


 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/web3devworld/decentralized-event-ticketing.git
   cd decentralized-event-ticketing
   ```

2. Install dependencies:
   - For the Rust program:
     ```bash
     cd programs/ticket-dapp
     cargo build
     ```
   - For the React frontend:
     ```bash
     cd app
     npm install
     ```

3. Build the Anchor program:
   ```bash
   anchor build
   ```

4. Start the React frontend:
   ```bash
   cd app
   npm start
   ```

 Deployment Instructions
 Smart Contract Deployment
1. Set up your Solana wallet and fund it with SOL:
   ```bash
   solana-keygen new
   solana airdrop 2
   ```

2. Deploy the program to the Solana devnet:
   ```bash
   solana config set --url https://api.devnet.solana.com
   anchor deploy
   ```

3. Update the `declare_id!` macro in `lib.rs` with the program ID generated during deployment.

 Frontend Deployment
1. Build the React app for production:
   ```bash
   npm run build
   ```

2. Deploy the static files to a hosting service like Vercel, Netlify, or GitHub Pages:
   - Example for Vercel:
     ```bash
     vercel
     ```

 Contribution Guidelines
We welcome contributions! To contribute, follow these steps:

1. Fork the Repository:
   - Click the "Fork" button on the top-right corner of this repository.

2. Clone Your Fork:
   ```bash
   git clone https://github.com/<your-username>/decentralized-event-ticketing.git
   cd decentralized-event-ticketing
   ```

3. Create a New Branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make Changes:
   - Write clean, well-documented code.
   - Test your changes locally.

5. Commit Your Changes:
   ```bash
   git add .
   git commit -m "Add meaningful commit message"
   ```

6. Push to Your Fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request:
   - Go to the original repository: https://github.com/web3devworld/decentralized-event-ticketing
   - Click "Compare & Pull Request".
   - Provide a detailed description of your changes and submit the PR.

8. Code Review:
   - Your PR will be reviewed by maintainers. Address any feedback and make necessary updates.


 License
This project is licensed under the MIT License. 

Built with ❤️ by Web3Dev  
🌐 Website: https://web3dev.click
📧 Email: support@web3dev.click  

> "Empowering the decentralized future, one line of code at a time."



 Final Notes
This `README.md` provides a comprehensive overview of your project, including setup, deployment, and contribution instructions.
