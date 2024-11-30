import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
const walle = [new PetraWallet()];
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptosWalletAdapterProvider
      plugins={walle}
      optInWallets={["Petra", "Mizu Wallet", "Pontem Wallet", "T wallet"]}
      onError={(error) => {
        console.log("error", error);
      }}
      autoConnect={true}
    >
      <App />
    </AptosWalletAdapterProvider>
  </StrictMode>
);
