import { createConfig, http, useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits, parseUnits } from 'viem';

// --- Chain Definition ---
export const worldChain = defineChain({
  id: 480,
  name: 'World Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: { name: 'WorldScan', url: 'https://worldscan.org' },
  },
});

export const config = createConfig({
  chains: [worldChain],
  transports: {
    [worldChain.id]: http(),
  },
  connectors: [injected()],
});

// --- Constants ---
const TOKEN_ADDRESS = '0xd2f234926d10549a7232446cc1ff2e3a2fa57581';
const STAKING_ADDRESS = '0xd4292d1c53d6e025156c6ef0dd3d7645eb85dfe3';

// --- ABIs ---
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  }
] as const;

// Assumed Standard Staking ABI based on requirements
const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getReward',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'earned',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'exit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  }
] as const;

// --- Hooks ---

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    // Prefer injected (Metamask/World App)
    const connector = connectors[0];
    connect({ connector });
  };

  return { address, isConnected, connectWallet, disconnect };
}

export function useTokenBalance(address?: `0x${string}`) {
  return useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 } 
  });
}

export function useStakedBalance(address?: `0x${string}`) {
  return useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 }
  });
}

export function useEarnedRewards(address?: `0x${string}`) {
  return useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'earned',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 }
  });
}

// Hook for staking operations
export function useStakingActions() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  // Wait for transaction to complete
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const stake = (amount: string) => {
    // 1. Approve (usually handled in UI flow, but simpler here: we assume approval exists or is handled separately)
    // For simplicity in this specialized hook, we'll just call the contract method.
    // The UI should handle the Approve -> Stake flow.
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [parseUnits(amount, 18)],
    });
  };
  
  const approve = (amount: string) => {
    writeContract({
      address: TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [STAKING_ADDRESS, parseUnits(amount, 18)],
    });
  };

  const withdraw = (amount: string) => {
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'withdraw',
      args: [parseUnits(amount, 18)],
    });
  };

  const claim = () => {
    writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'getReward',
    });
  };
  
  const exit = () => {
     writeContract({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'exit',
    });
  };

  return { 
    stake, 
    withdraw, 
    claim, 
    exit,
    approve,
    hash, 
    isPending, 
    isConfirming, 
    isSuccess, 
    error 
  };
}

export function useAllowance(owner?: `0x${string}`) {
  return useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: owner ? [owner, STAKING_ADDRESS] : undefined,
    query: { enabled: !!owner, refetchInterval: 5000 }
  });
}
