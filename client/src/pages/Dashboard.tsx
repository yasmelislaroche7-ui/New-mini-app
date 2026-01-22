import { useState, useEffect } from 'react';
import { useWallet, useTokenBalance, useStakedBalance, useEarnedRewards, useAllowance, useStakingActions } from "@/hooks/use-web3";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import { MetricCard } from "@/components/MetricCard";
import { MatrixRain } from "@/components/MatrixRain";
import { ConnectWallet } from "@/components/ConnectWallet";
import { formatUnits, parseUnits } from "viem";
import { ArrowRightLeft, Lock, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const { data: tokenBalance, isLoading: isLoadingToken } = useTokenBalance(address);
  const { data: stakedBalance, isLoading: isLoadingStaked } = useStakedBalance(address);
  const { data: earnedRewards, isLoading: isLoadingEarned } = useEarnedRewards(address);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(address);
  
  const { 
    stake, 
    withdraw, 
    claim, 
    approve, 
    isPending, 
    isConfirming, 
    isSuccess, 
    error: txError,
    hash
  } = useStakingActions();
  
  const { toast } = useToast();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("stake");

  // Effect for transaction feedback
  useEffect(() => {
    if (isConfirming) {
      toast({
        title: "PROCESSING TRANSACTION",
        description: "Please wait while the blockchain confirms your action...",
        duration: 5000,
      });
    }
    if (isSuccess) {
      toast({
        title: "SUCCESS",
        description: "Transaction confirmed on World Chain.",
        className: "border-primary text-primary",
      });
      setStakeAmount("");
      setWithdrawAmount("");
      refetchAllowance();
    }
    if (txError) {
      toast({
        title: "ERROR",
        description: txError.message.slice(0, 100) + "...",
        variant: "destructive",
      });
    }
  }, [isConfirming, isSuccess, txError, toast, refetchAllowance]);


  // Helper to format BigInt
  const fmt = (val?: bigint) => val ? parseFloat(formatUnits(val, 18)).toFixed(4) : "0.0000";
  const fmtFull = (val?: bigint) => val ? formatUnits(val, 18) : "0";

  const handleStake = () => {
    if (!stakeAmount || isNaN(Number(stakeAmount))) return;
    
    // Check allowance first
    const amountBig = parseUnits(stakeAmount, 18);
    const allowanceBig = allowance || 0n;

    if (allowanceBig < amountBig) {
      approve(stakeAmount);
    } else {
      stake(stakeAmount);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
    withdraw(withdrawAmount);
  };

  const setMaxStake = () => {
    if (tokenBalance) setStakeAmount(fmtFull(tokenBalance));
  };

  const setMaxWithdraw = () => {
    if (stakedBalance) setWithdrawAmount(fmtFull(stakedBalance));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <MatrixRain />
        <div className="z-10 text-center space-y-8 max-w-md w-full bg-black/80 p-8 border border-primary/20 backdrop-blur-sm">
          <div className="space-y-2">
             <h1 className="text-4xl font-black text-primary glitch-effect">MATRIX STAKE</h1>
             <p className="text-primary/60 font-mono text-sm">SECURE • DECENTRALIZED • WORLD CHAIN</p>
          </div>
          
          <div className="p-6 border border-primary/10 bg-primary/5">
             <p className="text-sm font-mono mb-6 text-primary/80">
               Connect your wallet to access the Matrix Staking Protocol on World Chain (Chain ID 480).
             </p>
             <ConnectWallet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <MatrixRain />
      
      {/* Header */}
      <header className="border-b border-primary/20 bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary animate-pulse" />
            <span className="font-bold text-lg tracking-widest text-primary">MATRIX<span className="text-white">STAKE</span></span>
          </div>
          <ConnectWallet />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            label="Wallet Balance" 
            value={`${fmt(tokenBalance)} MTXs`}
            subValue="AVAILABLE"
            icon={<ArrowRightLeft className="w-6 h-6" />}
            isLoading={isLoadingToken}
          />
          <MetricCard 
            label="Total Staked" 
            value={`${fmt(stakedBalance)} MTXs`}
            subValue="LOCKED IN PROTOCOL"
            icon={<Lock className="w-6 h-6" />}
            isLoading={isLoadingStaked}
          />
          <MetricCard 
            label="Unclaimed Rewards" 
            value={`${fmt(earnedRewards)} MTXs`}
            subValue="EARNED"
            icon={<Trophy className="w-6 h-6" />}
            isLoading={isLoadingEarned}
          />
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Action Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-primary/20 p-6 md:p-8">
              <Tabs defaultValue="stake" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-primary/10 mb-8 p-1">
                  <TabsTrigger 
                    value="stake"
                    className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest"
                  >
                    Stake
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unstake"
                    className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest"
                  >
                    Unstake
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="stake" className="space-y-6 focus:outline-none">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-primary/60">
                         <span>STAKE MTXs TO EARN REWARDS</span>
                         <span>MAX: {fmt(tokenBalance)}</span>
                      </div>
                      
                      <CyberInput 
                        type="number" 
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        action={
                          <button 
                            onClick={setMaxStake}
                            className="text-xs text-primary hover:text-white uppercase font-bold"
                          >
                            Max
                          </button>
                        }
                      />

                      <div className="p-4 border border-primary/20 bg-primary/5 text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-primary/60">APY Rate</span>
                          <span className="text-primary font-bold">~12.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary/60">Lock Period</span>
                          <span className="text-primary font-bold">24 Hours</span>
                        </div>
                      </div>

                      <CyberButton 
                        onClick={handleStake}
                        className="w-full h-14 text-lg"
                        disabled={!stakeAmount || Number(stakeAmount) <= 0 || isPending}
                        isLoading={isPending}
                      >
                        {isPending ? "PROCESSING..." : (allowance && allowance < parseUnits(stakeAmount || '0', 18) ? "APPROVE & STAKE" : "STAKE TO EARN")}
                      </CyberButton>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="unstake" className="space-y-6 focus:outline-none">
                     <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-primary/60">
                         <span>WITHDRAW YOUR TOKENS</span>
                         <span>STAKED: {fmt(stakedBalance)}</span>
                      </div>
                      
                      <CyberInput 
                        type="number" 
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        action={
                          <button 
                            onClick={setMaxWithdraw}
                            className="text-xs text-primary hover:text-white uppercase font-bold"
                          >
                            Max
                          </button>
                        }
                      />

                      <div className="flex items-start gap-3 p-4 border border-destructive/30 bg-destructive/10 text-xs font-mono">
                         <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                         <div className="space-y-1">
                           <p className="font-bold text-destructive">WARNING: 24H LOCK PERIOD</p>
                           <p className="text-destructive/80">
                             Withdrawals reset your reward multiplier. Ensure your 24h lock period has passed before unstaking to avoid penalties.
                           </p>
                         </div>
                      </div>

                      <CyberButton 
                        variant="destructive"
                        onClick={handleWithdraw}
                        className="w-full h-14 text-lg"
                        disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || isPending}
                        isLoading={isPending}
                      >
                        {isPending ? "PROCESSING..." : "UNSTAKE & WITHDRAW"}
                      </CyberButton>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </div>
          </div>

          {/* Stats & Claims Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-primary/20 p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                REWARD CENTER
              </h2>

              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-8">
                <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                   <div className="absolute inset-0 border-4 border-primary/50 border-t-transparent rounded-full animate-spin duration-[3s]" />
                   <div className="space-y-1">
                      <p className="text-3xl font-bold text-white">{fmt(earnedRewards)}</p>
                      <p className="text-[10px] text-primary">PENDING</p>
                   </div>
                </div>
                <p className="text-sm text-primary/60 max-w-[200px]">
                  Rewards accumulate every block. Claim them at any time.
                </p>
              </div>

              <div className="space-y-4 mt-auto">
                 <CyberButton 
                   onClick={() => claim()}
                   className="w-full"
                   disabled={!earnedRewards || earnedRewards === 0n || isPending}
                   isLoading={isPending}
                 >
                   CLAIM REWARDS
                 </CyberButton>
                 
                 <div className="text-center">
                   <p className="text-[10px] text-primary/40 font-mono">
                     CONTRACT: {STAKING_ADDRESS.slice(0, 8)}...{STAKING_ADDRESS.slice(-6)}
                   </p>
                 </div>
              </div>
            </div>
          </div>
        
        </div>
      </main>
    </div>
  );
}
