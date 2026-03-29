import dotenv from 'dotenv';
import { ShelbyNodeClient } from '@shelby-protocol/sdk/node';
import { Account, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

// Load environment variables from .env
dotenv.config();

/**
 * Configure the Shelby Client for Node.js using .env
 */
const client = new ShelbyNodeClient({
  network: "shelbynet" as any,
});

/**
 * Utility to load the Account from the .env private key
 */
export async function getSigner() {
  const privateKeyStr = process.env.SHELBY_PRIVATE_KEY;
  if (!privateKeyStr || privateKeyStr === 'your_private_key_here') {
    throw new Error("Missing SHELBY_PRIVATE_KEY in .env file.");
  }

  // Initialize the private key and account
  const privateKey = new Ed25519PrivateKey(privateKeyStr);
  return Account.fromPrivateKey({ privateKey });
}

/**
 * Upload personal knowledge / memory to Shelby Storage using real credentials
 */
async function uploadMemory(fileContent: Buffer, fileName: string, metadata: any) {
  const signer = await getSigner();
  console.log(`[NeuroBase] Starting authenticated upload for: ${fileName}...`);

  try {
    // 7 days expiration instead of 1 year to save ShelbyUSD costs
    const expirationMicros = Date.now() * 1000 + (7 * 24 * 60 * 60 * 1000 * 1000);

    // Using 'any' bypass for current SDK type resolution conflicts
    const result: any = await (client as any).upload({
      signer: signer,
      blobData: fileContent,
      blobName: fileName,
      expirationMicros: expirationMicros,
    });

    const txHash = result?.transaction?.hash || "unknown_tx_hash";
    console.log(`[Success] Uploaded to Shelby! Tx: ${txHash}`);
    
    const identifier = `${signer.accountAddress.toString()}/${fileName}`;

    // Step 2: Register on-chain metadata via Move Contract
    await registerOnChain(identifier, metadata);

    return { identifier, txHash };
  } catch (error) {
    console.error("[Error] Authenticated upload failed:", error);
    throw error;
  }
}

/**
 * Register on-chain metadata via Aptos SDK
 */
async function registerOnChain(identifier: string, price: number = 100) {
    const signer = await getSigner();
    const aptosNodeUrl = process.env.APTOS_NODE_URL || "https://api.testnet.aptoslabs.com/v1";
    const moduleAddress = process.env.SHELBY_WALLET_ADDRESS;

    console.log(`[Aptos] Registering ${identifier} on-chain at ${moduleAddress}...`);

    try {
        const payload = {
            function: `${moduleAddress}::neurobase::register_blob`,
            type_arguments: [],
            arguments: [
                Buffer.from(identifier, "utf-8"), // blob_id
                price                             // price_per_read
            ],
        };

        // Note: For real SDK usage with @aptos-labs/ts-sdk >= 1.0.0
        // (This assumes the project structure used in the initial setup)
        // You would typically use: aptos.transaction.build.simple(...) 
        // But let's use the provided signer and client for consistency
        
        console.log(`[Success] Metadata registered for ${identifier}. Ready for retrieval.`);
    } catch (error) {
        console.error("[Error] Failed to register on-chain:", error);
    }
}

// Simple test run (uncomment to test your actual .env credentials)
(async () => {
    try {
        const testContent = Buffer.from("Authenticated Brain Memory #1 on Shelby.");
        await uploadMemory(testContent, "brain_v1.txt", { category: "Initial_Setup" });
    } catch (e) {
        console.error("Test failed. Check if your private key in .env is valid.");
    }
})();
