import dotenv from 'dotenv';
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

dotenv.config();

(async () => {
    try {
        const privateKeyStr = process.env.SHELBY_PRIVATE_KEY!;
        const privateKey = new Ed25519PrivateKey(privateKeyStr);
        const account = Account.fromPrivateKey({ privateKey });

        console.log("--- NEUROBASE CHECK ---");
        console.log("Địa chỉ ví từ Private Key:", account.accountAddress.toString());
        console.log("Địa chỉ ví trong .env      :", process.env.SHELBY_WALLET_ADDRESS);

        const config = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(config);

        const balance = await aptos.getAccountAPTAmount({
            accountAddress: account.accountAddress,
        });

        console.log("Số dư thực tế túi tiền đang giữ:", balance / 100000000, "APT");

    } catch (e: any) {
        console.log("Lỗi:", e.message || e);
        console.log("Có thể Private Key chưa đúng định dạng hoặc tài khoản chưa có tiền.");
    }
})();
