// import { SignatureConfig, SIG_CONFIG } from "../../constants";
// import { Chain, hashMessage } from "viem";
// import type { Signer } from "../index";
// import { type WalletClient, type PublicClient, recoverPublicKey } from "viem";

// export class WagmiEthereumSigner implements Signer {
//   protected walletClient: WalletClient;
//   protected publicClient: PublicClient;
//   protected chain: Chain;
//   public publicKey: Buffer;

//   readonly ownerLength: number = SIG_CONFIG[SignatureConfig.ETHEREUM].pubLength;
//   readonly signatureLength: number = SIG_CONFIG[SignatureConfig.ETHEREUM].sigLength;
//   readonly signatureType: SignatureConfig = SignatureConfig.ETHEREUM;

//   constructor(walletClient: WalletClient, publicClient: PublicClient, chain: Chain) {
//     this.walletClient = walletClient;
//     this.publicClient = publicClient;
//     this.chain = chain;
//   }

//   async setPublicKey(): Promise<void> {
//     if (!this.walletClient.account) {
//       throw new Error("No account connected");
//     }

//     const message = "sign this message to connect to Bundlr.Network";
//     const signature = await this.walletClient.signMessage({
//       message,
//       account: this.walletClient.account.address,
//     });

//     const hash = hashMessage(message);
//     const recoveredKey = await recoverPublicKey({ hash, signature });
//     this.publicKey = Buffer.from(recoveredKey.slice(2), "hex");
//   }

//   async sign(message: Uint8Array): Promise<Uint8Array> {
//   if (!this.publicKey) {
//     await this.setPublicKey();
//   }

//   if (!this.walletClient.account) {
//     throw new Error("No account connected");
//   }

//   // Convert Uint8Array to a string for `signMessage`
//   const messageAsString = Buffer.from(message).toString("utf-8");

//   const signature = await this.walletClient.signMessage({
//     message: messageAsString,
//     account: this.walletClient.account.address,
//   });

//   return Buffer.from(signature.slice(2), "hex");
// }

//   static async verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean> {
//     try {
//             const messageAsString = Buffer.from(message).toString("utf-8");
//       const recoveredAddress = await recoverPublicKey({
//         hash: hashMessage(messageAsString),
//         signature: `0x${Buffer.from(signature).toString("hex")}`,
//       });
//       return `0x${pk.toString("hex")}` === recoveredAddress;
//     } catch {
//       return false;
//     }
//   }
// }

// export default WagmiEthereumSigner;
