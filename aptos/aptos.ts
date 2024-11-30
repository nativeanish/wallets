import { message, result } from "@permaweb/aoconnect";
import {
  SignMessagePayload,
  SignMessageResponse,
} from "@aptos-labs/wallet-adapter-core";
import InjectedAptosSigner from "./bundles/signing/chains/InjectedAptosSigner";
import { createData } from "./bundles/ar-data-create";
const createBrowserSolanaDataItemSigner = (
  signMessage: Fn,
  publicKey: string
) => {
  const signer = async ({ data, tags, target, anchor }: any) => {
    const provider = {
      signMessage,
    };
    const signer = new InjectedAptosSigner(
      provider,
      Buffer.from(publicKey.replace(/^0x/, ""), "hex")
    );
    const dataItem = createData(data, signer, { tags, target, anchor });
    const res = await dataItem
      .sign(signer)
      .then(async () => ({
        id: dataItem.id,
        raw: dataItem.getRaw(),
      }))
      .catch((e) => console.error(e));
    return res;
  };
  return signer;
};
type Fn = (message: SignMessagePayload) => Promise<SignMessageResponse>;
export default async function run(signMessage: Fn, publicKey: string) {
  console.log("Starting");
  const dataItem = createBrowserSolanaDataItemSigner(signMessage, publicKey);
  const raw = await message({
    signer: dataItem as any,
    tags: [
      { name: "Action", value: "add" },
      { name: "key", value: "test51" },
    ],
    process: "hQ-Ke9cODSw-IFc26hyJ9DzbHAV32tWardbR3SVfhLw",
  });
  console.log(raw);
  const msg = await result({
    process: "hQ-Ke9cODSw-IFc26hyJ9DzbHAV32tWardbR3SVfhLw",
    message: raw,
  });
  console.log(msg);
}
