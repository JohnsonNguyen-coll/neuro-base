import * as dotenv from 'dotenv';
import { ShelbyNodeClient } from '@shelby-protocol/sdk/node';
import { Account, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

// Load environment variables from .env
dotenv.config();

/**
 * Configure the Shelby Client for Node.js using .env
 */
const client = new ShelbyNodeClient({
  network: Network.TESTNET,
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
    const expirationMicros = Date.now() * 1000 + (365 * 24 * 60 * 60 * 1000 * 1000);

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
 * Register on-chain metadata
 */
async function registerOnChain(identifier: string, metadata: any) {
    console.log(`[Aptos] Registering ${identifier} on-chain with metadata:`, metadata);
    // TODO: Use Aptos SDK to trigger neurobase::register_blob
}

// Simple test run (uncomment to test your actual .env credentials)
/*
(async () => {
    try {
        const testContent = Buffer.from("Authenticated Brain Memory #1 on Shelby.");
        await uploadMemory(testContent, "brain_v1.txt", { category: "Initial_Setup" });
    } catch (e) {
        console.error("Test failed. Check if your private key in .env is valid.");
    }
})();
*/
