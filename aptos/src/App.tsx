import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PetraWalletName } from "petra-plugin-wallet-adapter";
import run from "../aptos";
function App() {
  const { connect, connected, account, signMessage, disconnect } = useWallet();

  const onConnect = async () => {
    connect(PetraWalletName);
  };
  const ru = () => {
    if (account?.publicKey && typeof account.publicKey === "string") {
      console.log(account.publicKey);
      run(signMessage, account?.publicKey)
        .then(console.log)
        .catch(console.error);
    } else {
      console.log(`Went wrong ${JSON.stringify(account?.publicKey)}`);
    }
  };
  return (
    <div>
      {connected ? (
        <>
          <div>Connected to {account?.address}</div>
          <button onClick={() => ru()}>Run</button>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <>
          <button onClick={() => onConnect()}>Connect</button>
        </>
      )}
      <h1>Hello</h1>
    </div>
  );
}

export default App;
