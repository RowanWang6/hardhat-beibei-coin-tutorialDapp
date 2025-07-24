import { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatEther, parseEther } from 'viem';
import { Coins, Send, Zap, Shield, Search, Flame } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/wagmi';
import StatusMessage from './StatusMessage';

const TokenDApp = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({ message: '', type: 'success' });

  // Form states
  const [mintData, setMintData] = useState({ to: '', amount: '' });
  const [transferData, setTransferData] = useState({ to: '', amount: '' });
  const [approveData, setApproveData] = useState({ spender: '', amount: '' });
  const [burnAmount, setBurnAmount] = useState('');
  const [queryAddress, setQueryAddress] = useState('');

  // Contract interactions
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read contract data
  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
    query: { enabled: isConnected },
  });

  const {
    data: owner,
    refetch: refetchOwner,
    error: ownerError,
    isLoading: ownerLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'owner',
    query: {
      enabled: isConnected, // 只有连接时才执行
      staleTime: 0, // 强制每次重新获取
      refetchOnMount: true, // 组件挂载时重新获取
    },
  });

  const { data: queriedBalance, refetch: refetchQueriedBalance } =
    useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'balanceOf',
      args: queryAddress ? [queryAddress as `0x${string}`] : undefined,
      query: { enabled: !!queryAddress },
    });

  const isOwner =
    owner && address
      ? (owner as string).toLowerCase() === address.toLowerCase()
      : false;

  // 调试信息
  console.log('调试信息:', {
    address,
    owner,
    isOwner,
    addressLower: address?.toLowerCase(),
    ownerLower: owner ? (owner as string).toLowerCase() : null,
  });

  // Status helper
  const showStatus = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      setStatus({ message, type });
      setTimeout(() => setStatus({ message: '', type: 'success' }), 5000);
    },
    [setStatus]
  );

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    try {
      await Promise.all([refetchBalance(), refetchTotalSupply()]);
      showStatus('余额已刷新');
    } catch (err) {
      showStatus(`刷新余额失败${(err as Error).message}`, 'error');
    }
  }, [refetchBalance, refetchTotalSupply, showStatus]);

  // Contract operations
  const mint = async () => {
    if (!mintData.to || !mintData.amount) return;
    try {
      const amount = parseEther(mintData.amount);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        args: [mintData.to as `0x${string}`, amount],
        chainId: 31337, // 明确指定链ID
      });
    } catch (err) {
      showStatus(
        `铸造失败: ${err instanceof Error ? err.message : '未知错误'}`,
        'error'
      );
    }
  };

  const transfer = async () => {
    if (!transferData.to || !transferData.amount) return;
    try {
      const amount = parseEther(transferData.amount);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'transfer',
        args: [transferData.to as `0x${string}`, amount],
        chainId: 31337,
      });
    } catch (err) {
      showStatus(
        `转账失败: ${err instanceof Error ? err.message : '未知错误'}`,
        'error'
      );
    }
  };

  const approve = async () => {
    if (!approveData.spender || !approveData.amount) return;
    try {
      const amount = parseEther(approveData.amount);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'approve',
        args: [approveData.spender as `0x${string}`, amount],
        chainId: 31337,
      });
    } catch (err) {
      showStatus(
        `授权失败: ${err instanceof Error ? err.message : '未知错误'}`,
        'error'
      );
    }
  };

  const burn = async () => {
    if (!burnAmount) return;
    try {
      const amount = parseEther(burnAmount);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'burn',
        args: [amount],
        chainId: 31337,
      });
    } catch (err) {
      showStatus(
        `销毁失败: ${err instanceof Error ? err.message : '未知错误'}`,
        'error'
      );
    }
  };

  const queryBalance = async () => {
    if (!queryAddress) return;
    try {
      await refetchQueriedBalance();
      showStatus('查询成功');
    } catch (err) {
      showStatus(
        `查询失败: ${err instanceof Error ? err.message : '未知错误'}`,
        'error'
      );
    }
  };

  // Handle transaction status
  useEffect(() => {
    if (isPending) {
      showStatus('交易已提交，等待确认...', 'warning');
    }
  }, [isPending, showStatus]);

  useEffect(() => {
    if (isConfirming) {
      showStatus('等待区块确认...', 'warning');
    }
  }, [isConfirming, showStatus]);

  useEffect(() => {
    if (isConfirmed) {
      showStatus('交易成功!', 'success');
      // Clear forms and refresh data
      setMintData({ to: '', amount: '' });
      setTransferData({ to: '', amount: '' });
      setApproveData({ spender: '', amount: '' });
      setBurnAmount('');
      refreshBalances();
    }
  }, [isConfirmed, refreshBalances, showStatus]);

  useEffect(() => {
    if (error) {
      showStatus(`交易失败: ${error.message}`, 'error');
    }
  }, [error, showStatus]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Coins className="w-12 h-12 text-blue-400" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            BeiBei Coin
          </h1>
        </div>
        <p className="text-xl text-gray-300 mb-8">
          BeiBeiCoin (BBC) 代币交互界面
        </p>

        {/* Connect Button */}
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {/* 调试信息 */}
        {isConnected && (
          <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">调试信息:</h3>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    refetchOwner();
                    refetchBalance();
                    refetchTotalSupply();
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs">
                  刷新数据
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { createPublicClient, http } = await import('viem');
                      const client = createPublicClient({
                        chain: {
                          id: 31337,
                          name: 'Hardhat Local',
                          nativeCurrency: {
                            decimals: 18,
                            name: 'Ether',
                            symbol: 'ETH',
                          },
                          rpcUrls: {
                            default: { http: ['http://127.0.0.1:8545'] },
                          },
                        },
                        transport: http('http://127.0.0.1:8545'),
                      });
                      const result = await client.readContract({
                        address: CONTRACT_ADDRESS as `0x${string}`,
                        abi: CONTRACT_ABI,
                        functionName: 'owner',
                      });
                      showStatus(`直接调用成功: ${result}`, 'success');
                    } catch (err) {
                      showStatus(
                        `直接调用失败: ${(err as Error).message}`,
                        'error'
                      );
                    }
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs">
                  直接测试
                </button>
              </div>
            </div>
            <div>当前地址: {address}</div>
            <div>
              当前网络: {chainId} {chainId === 31337 ? '✅' : '❌ (需要31337)'}
            </div>
            <div>
              合约所有者:{' '}
              {ownerLoading ? '加载中...' : (owner as string) || '未获取到'}
            </div>
            <div>合约地址: {CONTRACT_ADDRESS}</div>
            <div>是否为所有者: {isOwner ? '是' : '否'}</div>
            <div>
              地址匹配:{' '}
              {address?.toLowerCase() === (owner as string)?.toLowerCase()
                ? '匹配'
                : '不匹配'}
            </div>
            {chainId !== 31337 && (
              <button
                onClick={() => switchChain?.({ chainId: 31337 })}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs">
                切换到 Hardhat 网络
              </button>
            )}
            {ownerError && (
              <div className="text-red-400 mt-2">
                <strong>Owner 读取错误:</strong> {ownerError.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Message */}
      {status.message && (
        <div className="mb-8">
          <StatusMessage message={status.message} type={status.type} />
        </div>
      )}

      {!isConnected ? (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              欢迎使用 MyToken DApp
            </h2>
            <p className="text-gray-300 mb-6">请连接您的钱包开始使用</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Token Info */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Coins className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">代币信息</h2>
            </div>

            <div className="space-y-4">
              <div className="balance-display">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  我的余额
                </h3>
                <div className="balance-value">
                  {userBalance ? formatEther(userBalance as bigint) : '0'} BBC
                </div>
              </div>

              <div className="balance-display">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  总供应量
                </h3>
                <div className="balance-value">
                  {totalSupply ? formatEther(totalSupply as bigint) : '0'} BBC
                </div>
              </div>

              <button
                onClick={refreshBalances}
                disabled={isPending || isConfirming}
                className="btn-secondary w-full">
                刷新余额
              </button>
            </div>
          </div>

          {/* Mint Tokens (Owner Only) */}
          {isOwner && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">铸造代币</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    接收地址:
                  </label>
                  <input
                    type="text"
                    value={mintData.to}
                    onChange={e =>
                      setMintData({ ...mintData, to: e.target.value })
                    }
                    placeholder="0x..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    铸造数量:
                  </label>
                  <input
                    type="number"
                    value={mintData.amount}
                    onChange={e =>
                      setMintData({ ...mintData, amount: e.target.value })
                    }
                    placeholder="输入数量"
                    className="input-field"
                  />
                </div>

                <button
                  onClick={mint}
                  disabled={
                    isPending ||
                    isConfirming ||
                    !mintData.to ||
                    !mintData.amount
                  }
                  className="btn-primary w-full">
                  {isPending || isConfirming ? '处理中...' : '铸造代币'}
                </button>
              </div>
            </div>
          )}

          {/* Transfer */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">转账</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  接收地址:
                </label>
                <input
                  type="text"
                  value={transferData.to}
                  onChange={e =>
                    setTransferData({ ...transferData, to: e.target.value })
                  }
                  placeholder="0x..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  转账数量:
                </label>
                <input
                  type="number"
                  value={transferData.amount}
                  onChange={e =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
                  placeholder="输入数量"
                  className="input-field"
                />
              </div>

              <button
                onClick={transfer}
                disabled={
                  isPending ||
                  isConfirming ||
                  !transferData.to ||
                  !transferData.amount
                }
                className="btn-primary w-full">
                {isPending || isConfirming ? '处理中...' : '转账'}
              </button>
            </div>
          </div>

          {/* Approve */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">授权</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  授权地址:
                </label>
                <input
                  type="text"
                  value={approveData.spender}
                  onChange={e =>
                    setApproveData({ ...approveData, spender: e.target.value })
                  }
                  placeholder="0x..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  授权数量:
                </label>
                <input
                  type="number"
                  value={approveData.amount}
                  onChange={e =>
                    setApproveData({ ...approveData, amount: e.target.value })
                  }
                  placeholder="输入数量"
                  className="input-field"
                />
              </div>

              <button
                onClick={approve}
                disabled={
                  isPending ||
                  isConfirming ||
                  !approveData.spender ||
                  !approveData.amount
                }
                className="btn-primary w-full">
                {isPending || isConfirming ? '处理中...' : '授权'}
              </button>
            </div>
          </div>

          {/* Burn */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">销毁代币</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  销毁数量:
                </label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={e => setBurnAmount(e.target.value)}
                  placeholder="输入数量"
                  className="input-field"
                />
              </div>

              <button
                onClick={burn}
                disabled={isPending || isConfirming || !burnAmount}
                className="btn-primary w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:shadow-red-500/25">
                {isPending || isConfirming ? '处理中...' : '销毁代币'}
              </button>
            </div>
          </div>

          {/* Query Balance */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">查询功能</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  查询地址余额:
                </label>
                <input
                  type="text"
                  value={queryAddress}
                  onChange={e => setQueryAddress(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>

              <button
                onClick={queryBalance}
                disabled={!queryAddress}
                className="btn-secondary w-full">
                查询余额
              </button>

              {queriedBalance ? (
                <div className="balance-display">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    查询结果
                  </h3>
                  <div className="balance-value">
                    {formatEther(queriedBalance as bigint)} BBC
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDApp;
