import { http, createConfig } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "8aa31ab616f7bfece07cfeb7bc50c006";

export const config = createConfig({
  chains: [mainnet, optimism, base],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});
