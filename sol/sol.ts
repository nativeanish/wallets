import { message, result } from "@permaweb/aoconnect";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { createData } from "./bundles/ar-data-create";
import HexSolanaSigner from "./bundles/signing/chains/HexInjectedSolanaSigner";
interface ExtendedWalletAdapter extends WalletAdapter {
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}

const createBrowserSolanaDataItemSigner = (wallet: WalletAdapter) => {
  const signer = async ({ data, tags, target, anchor }: any) => {
    const solWallet = new HexSolanaSigner(wallet as ExtendedWalletAdapter);
    const dataItem = createData(data, solWallet, { tags, target, anchor });
    const res = await dataItem
      .sign(solWallet)
      .then(async () => ({
        id: dataItem.id,
        raw: dataItem.getRaw(),
      }))
      .catch((e) => console.error(e));
    console.log(res);
    return res;
  };
  return signer;
};
export default async function run(wallet: WalletAdapter) {
  console.log("Starting");
  const dataItem = createBrowserSolanaDataItemSigner(wallet);
  const raw = await message({
    signer: dataItem as any,
    tags: [
      { name: "Action", value: "add" },
      { name: "key", value: "test99" },
    ],
    process: "r_T7gFGVH2n9GzDkURzCaPOYm2L0PzhbOUxmSLrvj50",
  });
  console.log(raw);
  const msg = await result({
    process: "r_T7gFGVH2n9GzDkURzCaPOYm2L0PzhbOUxmSLrvj50",
    message: raw,
  });
  console.log(msg);
}
