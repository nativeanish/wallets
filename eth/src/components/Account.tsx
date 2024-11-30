import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from "wagmi";
import run from "../../eth2";
export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  // const walletClient = useWalletClient();
  // const publicClient = usePublicClient();
  // const chain = useChains();
  const formattedAddress = formatAddress(address);
  const { signMessageAsync } = useSignMessage();
  const ru = () => {
    run(signMessageAsync).then(console.log).catch(console.error);
    // signMessageAsync({ message })
    //   .then((d) => {
    //     const messageHash = ethers.utils.hashMessage(message);
    //     console.log(messageHash);
    //     //@ts-ignore
    //     recoverPublicKey({ hash: messageHash, signature: d }).then((d) => {
    //       console.log(d);
    //     });
    //   })
    //   .catch(console.error);
  };
  return (
    <div className="row">
      <div className="inline">
        {ensAvatar ? (
          <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
        ) : (
          <div className="avatar" />
        )}
        <div className="stack">
          {address && (
            <div className="text">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
          <div className="subtext">
            Connected to {connector?.name} Connector
          </div>
        </div>
      </div>
      <button className="button" onClick={() => ru()}>
        Run
      </button>
      <button className="button" onClick={() => disconnect()} type="button">
        Disconnect
      </button>
    </div>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}
