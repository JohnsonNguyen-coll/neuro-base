import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Network, Account } from "@aptos-labs/ts-sdk";

// Initialize the Shelby Client
const shelby = new ShelbyNodeClient({
  network: "shelbynet" as any,
});

/**
 * NeuroBase AI MCP Server
 * Converting Decentralized Blobs into Live Knowledge
 */
const server = new Server(
  {
    name: "neurobase-brain-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Define available tools for the AI Agent
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "recall_my_memory",
        description: "Retrieve personal knowledge from Shelby Protocol (Requires a small micropayment).",
        inputSchema: {
          type: "object",
          properties: {
            blobName: {
              type: "string",
              description: "The name of the memory/file to retrieve (e.g., 'chat_history_01.txt')",
            },
            ownerAddress: {
              type: "string",
              description: "The Aptos wallet address of the data owner",
            },
          },
          required: ["blobName", "ownerAddress"],
        },
      },
    ],
  };
});

/**
 * Handle tool execution calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "recall_my_memory") {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }

  const { blobName, ownerAddress } = request.params.arguments as {
      blobName: string,
      ownerAddress: string
  };

  try {
    console.error(`[NeuroBase] Agent is recalling memory: ${blobName} from ${ownerAddress}`);

    // FLOW: 1. Trigger Micropayment (Integration with Shelby Payment Channels)
    await simulateMicropayment(ownerAddress);

    // FLOW: 2. Download from Shelby RPC
    // Casting to any to avoid SDK version mismatch errors
    const blob: any = await (shelby as any).download({
        account: ownerAddress,
        blobName: blobName,
    });

    // FLOW: 3. Return content as context for the AI Agent
    const content = blob.data.toString("utf-8"); // Convert storage buffer to readable string
    
    return {
      content: [
        {
          type: "text",
          text: `[NeuroBase Content Loaded]\nMemory ID: ${blobName}\nOwner: ${ownerAddress}\nContent:\n${content}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Memory retrieval failed: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Placeholder for real Micropayment Logic
 */
async function simulateMicropayment(owner: string) {
    // Expected Call: (shelby as any).coordination.pay(...)
    console.error(`[Payment] Micropayment successfully sent to ${owner}. Access receipt generated.`);
}

/**
 * Start the server using Stdio transport
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("NeuroBase MCP Server is running on stdio transport.");
}

main().catch((error) => {
  console.error("Fatal Server Error:", error);
  process.exit(1);
});
