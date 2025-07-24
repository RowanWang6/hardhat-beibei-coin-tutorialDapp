import { ref, computed, onMounted, onUnmounted } from 'vue'
import { web3 } from '@/utils/web3'
import { ethers } from 'ethers'

export function useWeb3() {
  const account = ref('')
  const chainId = ref(0)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const userBalance = ref<bigint>(0n)
  const totalSupply = ref<bigint>(0n)
  const owner = ref('')
  const error = ref('')

  // 计算属性
  const isOwner = computed(() => {
    return owner.value && account.value 
      ? owner.value.toLowerCase() === account.value.toLowerCase()
      : false
  })

  const isCorrectNetwork = computed(() => chainId.value === 31337)

  // 连接钱包
  const connect = async () => {
    if (isConnecting.value) return
    
    isConnecting.value = true
    error.value = ''
    
    try {
      const success = await web3.connect()
      if (success) {
        account.value = web3.account
        chainId.value = web3.chainId
        isConnected.value = true
        
        // 加载初始数据
        await refreshData()
        
        // 监听账户和网络变化
        setupEventListeners()
      }
    } catch (err: any) {
      error.value = err.message || '连接失败'
      console.error('连接错误:', err)
    } finally {
      isConnecting.value = false
    }
  }

  // 断开连接
  const disconnect = () => {
    web3.disconnect()
    account.value = ''
    chainId.value = 0
    isConnected.value = false
    userBalance.value = 0n
    totalSupply.value = 0n
    owner.value = ''
    error.value = ''
    removeEventListeners()
  }

  // 切换到Hardhat网络
  const switchToHardhat = async () => {
    try {
      await web3.switchToHardhat()
      // 网络切换后重新获取状态
      setTimeout(async () => {
        if (web3.provider) {
          const network = await web3.provider.getNetwork()
          chainId.value = Number(network.chainId)
        }
      }, 1000)
    } catch (err: any) {
      error.value = err.message || '网络切换失败'
    }
  }

  // 刷新数据
  const refreshData = async () => {
    if (!isConnected.value || !account.value) return
    
    try {
      const [balance, supply, ownerAddr] = await Promise.all([
        web3.getBalance(account.value),
        web3.getTotalSupply(),
        web3.getOwner()
      ])
      
      userBalance.value = balance
      totalSupply.value = supply
      owner.value = ownerAddr
    } catch (err: any) {
      error.value = err.message || '刷新数据失败'
      console.error('刷新数据错误:', err)
    }
  }

  // 合约交互方法
  const mint = async (to: string, amount: string) => {
    if (!isConnected.value) throw new Error('请先连接钱包')
    
    try {
      const amountBN = ethers.parseEther(amount)
      const tx = await web3.mint(to, amountBN)
      await tx.wait()
      await refreshData()
      return tx
    } catch (err: any) {
      throw new Error(err.message || '铸造失败')
    }
  }

  const transfer = async (to: string, amount: string) => {
    if (!isConnected.value) throw new Error('请先连接钱包')
    
    try {
      const amountBN = ethers.parseEther(amount)
      const tx = await web3.transfer(to, amountBN)
      await tx.wait()
      await refreshData()
      return tx
    } catch (err: any) {
      throw new Error(err.message || '转账失败')
    }
  }

  const approve = async (spender: string, amount: string) => {
    if (!isConnected.value) throw new Error('请先连接钱包')
    
    try {
      const amountBN = ethers.parseEther(amount)
      const tx = await web3.approve(spender, amountBN)
      await tx.wait()
      await refreshData()
      return tx
    } catch (err: any) {
      throw new Error(err.message || '授权失败')
    }
  }

  const burn = async (amount: string) => {
    if (!isConnected.value) throw new Error('请先连接钱包')
    
    try {
      const amountBN = ethers.parseEther(amount)
      const tx = await web3.burn(amountBN)
      await tx.wait()
      await refreshData()
      return tx
    } catch (err: any) {
      throw new Error(err.message || '销毁失败')
    }
  }

  const queryBalance = async (address: string): Promise<bigint> => {
    if (!web3.contract) throw new Error('合约未初始化')
    return await web3.getBalance(address)
  }

  // 事件监听器
  const setupEventListeners = () => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== account.value) {
        account.value = accounts[0]
        web3.account = accounts[0]
        refreshData()
      }
    }

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16)
      chainId.value = newChainId
      web3.chainId = newChainId
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
  }

  const removeEventListeners = () => {
    if (!window.ethereum) return
    
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')
  }

  // 检查是否已连接
  const checkConnection = async () => {
    if (!window.ethereum) return
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        await connect()
      }
    } catch (err) {
      console.error('检查连接状态失败:', err)
    }
  }

  // 生命周期
  onMounted(() => {
    checkConnection()
  })

  onUnmounted(() => {
    removeEventListeners()
  })

  return {
    // 状态
    account,
    chainId,
    isConnected,
    isConnecting,
    userBalance,
    totalSupply,
    owner,
    error,
    
    // 计算属性
    isOwner,
    isCorrectNetwork,
    
    // 方法
    connect,
    disconnect,
    switchToHardhat,
    refreshData,
    mint,
    transfer,
    approve,
    burn,
    queryBalance
  }
}