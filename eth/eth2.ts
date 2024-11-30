import { message, result } from "@permaweb/aoconnect";
import { SignMessageMutateAsync } from "wagmi/query";
import { createData } from "./bundles/ar-data-create";
import { InjectedEthereumSigner } from "./bundles/signing/chains";
type SignMessageAsyncFn = SignMessageMutateAsync<unknown>;

export function createBrowserEthereumDataItemSigner(
  signMessage: SignMessageAsyncFn
) {
  /**
   * createDataItem can be passed here for the purposes of unit testing
   * with a stub
   */
  const signer = async ({ data, tags, target, anchor }: any) => {
    const provider = {
      getSigner: () => ({
        signMessage: async (message: any) => {
          console.log(convert(message));
          return await signMessage({ message: convert(message) });
        },
      }),
    };
    const ethSigner = new InjectedEthereumSigner(provider as any);
    await ethSigner.setPublicKey();
    const dataItem = createData(data, ethSigner, { tags, target, anchor });
    console.log(dataItem);
    const res = await dataItem
      .sign(ethSigner)
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
export default async function run(signMessage: SignMessageAsyncFn) {
  console.log("Starting");
  const dataItem = createBrowserEthereumDataItemSigner(signMessage);
  const raw = await message({
    signer: dataItem as any,
    tags: [
      { name: "Action", value: "add" },
      { name: "key", value: "mark88 " },
    ],
    process: "3Ea_yhLR3jfOTcQFp6_W2lpGoNzHOvZsL1OmCY7jOfk",
  });
  const msg = await result({
    process: "3Ea_yhLR3jfOTcQFp6_W2lpGoNzHOvZsL1OmCY7jOfk",
    message: raw,
  });
  console.log(msg);
}

export type ByteArray = Uint8Array;
export type Hex = `0x${string}`;
function convert(input: string | ByteArray | Hex) {
  if (typeof input === "string") {
    return input; // If input is already a string, return it as is.
  }
  return { raw: input };
}
