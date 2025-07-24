# Project Screenshots

Please add the following screenshots to this directory:

## Required Screenshots

1. **react-dashboard.png**
   - React version main dashboard
   - Size: 1200x800px or similar
   - Shows: Connected wallet, token balance, operation cards

2. **vue-dashboard.png**  
   - Vue version main dashboard
   - Size: 1200x800px or similar
   - Shows: Connected wallet, token balance, operation cards with Vue branding

3. **token-operations.png**
   - Token operations in action
   - Size: 800x600px or similar
   - Shows: Mint/Transfer/Approve/Burn operations

4. **wallet-connection.png**
   - Wallet connection process
   - Size: 600x400px or similar
   - Shows: MetaMask connection modal

## Optional Screenshots

5. **mobile-responsive.png**
   - Mobile responsive design
   - Size: 375x812px (iPhone dimensions)
   - Shows: Mobile layout of the DApp

6. **transaction-flow.png**
   - Transaction confirmation flow
   - Size: 800x600px or similar
   - Shows: MetaMask transaction confirmation

## Guidelines

- Use PNG format for better quality
- Ensure screenshots show the actual working application
- Include both light/dark themes if applicable
- Show realistic data (not just placeholder text)
- Crop screenshots to remove unnecessary browser UI
- Compress images to keep file sizes reasonable (< 500KB each)

## How to Take Screenshots

1. Start the development environment:
   ```bash
   npx hardhat node
   npx hardhat run scripts/fixed-addr-deploy-and-test.js --network localhost
   ```

2. Launch frontends:
   ```bash
   # React version
   cd frontend-react && npm run dev
   
   # Vue version  
   cd frontend-vue && npm run dev
   ```

3. Connect MetaMask and interact with the DApp
4. Take screenshots of key interactions
5. Save them in this directory with the specified names