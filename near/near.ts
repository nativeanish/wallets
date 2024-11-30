import { message, result } from "@permaweb/aoconnect";
import { createData } from "./bundles/ar-data-create";
import InjectedNearSigner, {
  InjectedNearWallet,
} from "./bundles/signing/chains/InjectedNearSigner";
import { Wallet } from "@near-wallet-selector/core";

export function createBrowserEthereumDataItemSigner(wallet: Wallet) {
  /**
   * createDataItem can be passed here for the purposes of unit testing
   * with a stub
   */
  const signer = async ({ data, tags, target, anchor }: any) => {
    const isInjectedNearWallet = (
      wallet: Wallet
    ): wallet is InjectedNearWallet => {
      return (
        typeof wallet.id === "string" &&
        wallet.metadata &&
        typeof wallet.metadata.description === "string" &&
        typeof wallet.metadata.name === "string" &&
        typeof wallet.metadata.iconUrl === "string" &&
        typeof wallet.signMessage === "function"
      );
    };
    if (!isInjectedNearWallet(wallet)) {
      throw new Error("Wallet does not conform to InjectedNearWallet");
    }
    const nearWallet = new InjectedNearSigner(wallet);
    await nearWallet.setPublicKey();
    const dataItem = createData(data, nearWallet, { tags, target, anchor });
    console.log(dataItem);
    const res = await dataItem
      .sign(nearWallet)
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
export default async function run(wallet: Wallet) {
  console.log("Starting");
  const dataItem = createBrowserEthereumDataItemSigner(wallet);
  const raw = await message({
    signer: dataItem as any,
    tags: [
      { name: "Action", value: "add" },
      { name: "key", value: "mark88 " },
    ],
    process: "TIJ4eKR7DwMhbeS5mMaKjCoBsEyerqc6bYQS2oIz5Ug",
  });
  const msg = await result({
    process: "TIJ4eKR7DwMhbeS5mMaKjCoBsEyerqc6bYQS2oIz5Ug",
    message: raw,
  });
  console.log(msg);
}
