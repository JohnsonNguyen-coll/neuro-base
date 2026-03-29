import dotenv from 'dotenv';
import { ShelbyNodeClient } from '@shelby-protocol/sdk/node';

dotenv.config();

/**
 * Recall / Download a blob from Shelby to verify it's there.
 */
async function testRecall() {
    const shelby = new ShelbyNodeClient({
        network: "shelbynet" as any,
    });

    const ownerAddress = process.env.SHELBY_WALLET_ADDRESS!;
    const blobName = "brain_v1.txt";

    console.log(`[NeuroBase] Recalling memory: ${blobName} from ${ownerAddress}...`);

    try {
        const blob: any = await (shelby as any).download({
            account: ownerAddress,
            blobName: blobName,
        });

        // Handle both 'data' (Buffer) and other potential structures
        const rawContent = blob.data || blob.content || blob;
        const content = Buffer.isBuffer(rawContent) ? rawContent.toString("utf-8") : String(rawContent);
        console.log("-----------------------------------------");
        console.log("SUCCESS! Recalled Brain Memory Content:");
        console.log("-----------------------------------------");
        console.log(content);
        console.log("-----------------------------------------");
    } catch (error: any) {
        console.error("[Error] Retrieval failed:", error.message || error);
        console.log("Tip: Make sure you have funded your Shelbynet wallet with ShelbyUSD.");
    }
}

testRecall();
