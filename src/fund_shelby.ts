import dotenv from 'dotenv';
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

dotenv.config();

(async () => {
    const privateKeyStr = process.env.SHELBY_PRIVATE_KEY!;
    const privateKey = new Ed25519PrivateKey(privateKeyStr);
    const account = Account.fromPrivateKey({ privateKey });

    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

    console.log("Đang nạp tiền vào Quỹ lưu trữ Shelby (Storage Fund)...");

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: account.accountAddress,
            data: {
                function: "0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a::blob_metadata::fund",
                typeArguments: [],
                functionArguments: [500000000], // 5 APT
            },
        });

        const senderAuthenticator = aptos.transaction.sign({ signer: account, transaction });
        const committedTransaction = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

        console.log("Đã nạp thành công! Transaction:", committedTransaction.hash);
        console.log("Bây giờ bạn hãy chạy lại npx tsx src/uploadMemory.ts");
    } catch (e) {
        console.log("Lỗi khi nạp tiền:", e);
    }
})();
