import type { BundleItem } from "./BundleItem";
import type Arweave from "@irys/arweave";
import type { JWKInterface } from "./interface-jwk";
import type { CreateTransactionInterface, Transaction } from "./util";

type ResolvesTo<T> = T | Promise<T> | ((...args: any[]) => Promise<T>);

export interface BundleInterface {
  readonly length: ResolvesTo<number>;
  readonly items: BundleItem[] | AsyncGenerator<BundleItem>;
  get(index: number | string): BundleItem | Promise<BundleItem>;
  getIds(): string[] | Promise<string[]>;
  getRaw(): ResolvesTo<Buffer>;
  toTransaction(
    attributes: Partial<CreateTransactionInterface>,
    arweave: Arweave,
    jwk: JWKInterface
  ): Promise<Transaction>;
}
