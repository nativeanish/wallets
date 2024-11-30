import { message, result } from "@permaweb/aoconnect";
import { type WalletClient, type PublicClient, Chain } from "viem";
import { createData } from "./bundles/ar-data-create";
import { WagmiEthereumSigner } from "./bundles/signing/chains";
export function createBrowserEthereumDataItemSigner(
  WalletClient: WalletClient,
  publicClient: PublicClient,
  chain: Chain
) {
  const signer = async ({ data, tags, target, anchor }: any) => {
    const eth = new WagmiEthereumSigner(WalletClient, publicClient, chain);
    await eth.setPublicKey();
    const dataItem = createData(data, eth, { tags, target, anchor });
    console.log(dataItem);
    const res = await dataItem
      .sign(eth)
      .then(async () => ({
        id: dataItem.id,
        raw: dataItem.getRaw(),
      }))
      .catch((e) => console.error(e));
    console.log(res);
    return res;
  };
  return signer;
}

export default async function run(
  WalletClient: WalletClient,
  publicClient: PublicClient,
  chain: Chain
) {
  console.log("Starting");
  const dataItem = createBrowserEthereumDataItemSigner(
    WalletClient,
    publicClient,
    chain
  );
  console.log(dataItem);
  const raw = await message({
    signer: dataItem as any,
    tags: [
      { name: "Action", value: "add" },
      { name: "key", value: "test500" },
    ],
    process: "ICSlKiuCxDqONydk_6kLrmg8gEvy21X1GadpEqd6OJM",
  });
  const msg = await result({
    process: "ICSlKiuCxDqONydk_6kLrmg8gEvy21X1GadpEqd6OJM",
    message: raw,
  });
  console.log(msg);
}
