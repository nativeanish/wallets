// src/App.tsx
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import run from "../sol";
const App = () => {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const getBalance = async () => {
    if (!publicKey) return;
    const balance = await connection.getBalance(publicKey);
    alert(`Balance: ${balance} lamports`);
  };
  const ru = () => {
    if (wallet?.adapter)
      run(wallet?.adapter).then(console.log).catch(console.error);
  };
  return (
    <div className="App">
      <h1>Solana React App</h1>
      <WalletMultiButton />

      {/* Show the wallet address if connected */}
      {publicKey ? (
        <div>
          <p>Connected Wallet Address:</p>
          <p>{publicKey.toBase58()}</p> {/* Display wallet address */}
          <p>{publicKey.toString()}</p> {/* Display wallet address */}
          <button onClick={getBalance}>Get Balance</button>
          <button onClick={() => ru()}>Run</button>
        </div>
      ) : (
        <p>Connect your wallet to see your address.</p>
      )}
    </div>
  );
};

export default App;
