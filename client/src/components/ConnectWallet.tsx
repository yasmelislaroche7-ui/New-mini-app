import { useWallet } from "@/hooks/use-web3";
import { CyberButton } from "./CyberButton";
import { Wallet } from "lucide-react";

export function ConnectWallet() {
  const { address, isConnected, connectWallet, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <CyberButton 
        variant="outline" 
        onClick={() => disconnect()}
        className="text-xs"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 inline-block animate-pulse" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </CyberButton>
    );
  }

  return (
    <CyberButton onClick={connectWallet} className="gap-2">
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </CyberButton>
  );
}
