import type { Signer } from "./Signer";
import Curve25519 from "./keys/curve25519";

import { WagmiEthereumSigner } from "./chains/index";

export type IndexToType = Record<
  number,
  {
    new (...args): Signer;
    readonly signatureLength: number;
    readonly ownerLength: number;
    verify(
      pk: string | Uint8Array,
      message: Uint8Array,
      signature: Uint8Array
    ): Promise<boolean>;
  }
>;

export const indexToType: IndexToType = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  1: WagmiEthereumSigner,
};
