import type { Signer } from "../index";
import base64url from "base64url";
import { SIG_CONFIG } from "../../constants";
import { verify } from "@noble/ed25519";
import type { Wallet } from "@near-wallet-selector/core";
import bs58 from "bs58";
import { randomBytes } from "crypto"; // or any other library to generate 32-byte buffers
export interface InjectedNearWalletMetadata {
  name: string;
  description: string;
  iconUrl: string;
  deprecated?: boolean;
  available(): Promise<boolean>;
}

export interface SignMessageParams {
  message: Uint8Array;
  recipient?: string;
  nonce?: Buffer;
  callbackUrl?: string;
  state?: string;
}

export type InjectedNearWallet = Wallet & {
  id: string;
  metadata: InjectedNearWalletMetadata;
  signMessage(params: SignMessageParams): Promise<Uint8Array>;
};

export default class InjectedNearSigner implements Signer {
  private pk: Buffer;
  readonly ownerLength: number = SIG_CONFIG[2].pubLength;
  readonly signatureLength: number = SIG_CONFIG[2].sigLength;
  readonly signatureType: number = 2;
  pem?: string | Buffer;
  wallet: InjectedNearWallet;

  constructor(wallet: InjectedNearWallet) {
    this.wallet = wallet;
    this.pk = Buffer.alloc(0);
  }

  public get publicKey(): Buffer {
    return this.pk;
  }

  async setPublicKey(): Promise<void> {
    const account = await this.wallet.getAccounts();
    if (!account || account.length === 0) {
      throw new Error("No accounts found in wallet");
    }
    if (account[0].publicKey) {
      console.log(account[0].publicKey);
      this.pk = Buffer.from(
        bs58.decode(account[0].publicKey.replace("ed25519:", ""))
      );
    } else {
      throw new Error("No public key found in wallet");
    }
  }
  async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.pk) {
      await this.setPublicKey();
    }

    if (!this.wallet.signMessage) {
      throw new Error(
        `${this.wallet.metadata.name} does not support message signing`
      );
    }

    try {
      const messageString = new TextDecoder().decode(message);
      const random = Buffer.from(randomBytes(32));
      const signature = await this.wallet.signMessage({
        message: messageString, // Pass the string version of the message
        recipient: "bundlr", // Optional recipient for the message
        nonce: random, // Optional nonce for uniqueness
      });

      if (signature) {
        if (signature instanceof Uint8Array) {
          return signature;
        }
        if (signature.signature) {
          return Buffer.from(signature.signature);
        }

        throw new Error("Failed to extract raw signature bytes");
      } else {
        throw new Error("Failed to sign message");
      }
    } catch (error) {
      throw new Error(
        //@ts-ignore
        `Failed to sign message with ${this.wallet.metadata.name}: ${error.message}`
      );
    }
  }

  static async verify(
    pk: Buffer | string,
    message: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    let publicKey = pk;
    if (typeof pk === "string") {
      publicKey = base64url.toBuffer(pk);
    }

    try {
      return verify(
        Buffer.from(signature),
        Buffer.from(message),
        Buffer.from(publicKey as Buffer)
      );
    } catch (error) {
      //@ts-ignore
      throw new Error(`Signature verification failed: ${error.message}`);
    }
  }
}
