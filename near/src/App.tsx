import React, { useState, useEffect } from "react";
import {
  setupWalletSelector,
  WalletSelector,
} from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import run from "../near";
const myNearWallet = setupMyNearWallet({
  walletUrl: "https://testnet.mynearwallet.com",
  iconUrl: "", // Optionally add an icon URL
});
const mathWallet = setupMathWallet({
  iconUrl: "https://<Wallet Icon URL Here>", // optional
});
const bitgetWallet = setupBitgetWallet();
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

// Meteor for Wallet Selector can be setup without any params or it can take few optional params, see options below.
const meteorWallet = setupMeteorWallet({
  iconUrl: "https://<Wallet Icon URL Here>", // optional
});

const App: React.FC = () => {
  const [walletSelector, setWalletSelector] = useState<WalletSelector | null>(
    null
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const initializeWalletSelector = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [myNearWallet, bitgetWallet, mathWallet, meteorWallet],
      });

      setWalletSelector(selector);

      // Check if the user is already signed in
      if (selector.isSignedIn()) {
        const accounts = selector.store.getState().accounts;
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].accountId);
          if (accounts[0].publicKey) {
            setPublicKey(accounts[0].publicKey);
          }
        }
      }
    };

    initializeWalletSelector().catch(console.error);
  }, []);

  const connect = async () => {
    if (!walletSelector) return;

    const modal = setupModal(walletSelector, {
      contractId: "test.testnet", // Replace with your contract ID
    });

    modal.show();
  };

  const signOut = async () => {
    if (!walletSelector) return;

    const wallet = await walletSelector.wallet();
    await wallet.signOut();
    setWalletAddress(null);
  };
  const signIn = () => {
    if (!walletSelector || !walletAddress) return;
    walletSelector.wallet().then((data) => {
      run(data).then(console.log).catch(console.error);
    });
  };
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>NEAR Wallet Selector</h1>
      {walletAddress ? (
        <div>
          <strong>Connected Wallet:</strong> {walletAddress}
          {publicKey && <p>Public Key: {publicKey}</p>}
          <button onClick={() => signIn()}>Signin</button>
          <button onClick={signOut} style={buttonStyle}>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={connect} style={buttonStyle}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};
const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#0072CE",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

export default App;
