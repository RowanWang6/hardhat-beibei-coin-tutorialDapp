import { ethers } from 'ethers'

export const CONTRACT_ADDRESS = '0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67'

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Burn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Mint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Web3 connection class
export class Web3Connection {
  public provider: ethers.BrowserProvider | null = null
  public signer: ethers.JsonRpcSigner | null = null
  public contract: ethers.Contract | null = null
  public account: string = ''
  public chainId: number = 0

  async connect(): Promise<boolean> {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask!')
    }

    try {
      // 使用 ethers v6 的 BrowserProvider (修复了 #notReady 问题)
      this.provider = new ethers.BrowserProvider(window.ethereum)
      
      // 请求账户访问
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // 获取签名者
      this.signer = await this.provider.getSigner()
      this.account = await this.signer.getAddress()
      
      // 获取网络信息
      const network = await this.provider.getNetwork()
      this.chainId = Number(network.chainId)
      
      // 创建合约实例
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer)
      
      return true
    } catch (error) {
      console.error('连接失败:', error)
      throw error
    }
  }

  async switchToHardhat(): Promise<void> {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }], // 31337 in hex
      })
    } catch (switchError: any) {
      // 如果网络不存在，尝试添加
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x7a69',
              chainName: 'Hardhat Local',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:8545'],
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  disconnect(): void {
    this.provider = null
    this.signer = null
    this.contract = null
    this.account = ''
    this.chainId = 0
  }

  isConnected(): boolean {
    return !!this.provider && !!this.account
  }

  // 合约交互方法 - 使用标准 ERC20 函数名 (修复了函数调用问题)
  async getBalance(address: string): Promise<bigint> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.balanceOf(address)  // 使用标准 ERC20 函数
  }

  async getTotalSupply(): Promise<bigint> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.totalSupply()  // 使用标准 ERC20 函数
  }

  async getOwner(): Promise<string> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.owner()
  }

  async mint(to: string, amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.mint(to, amount)
  }

  async transfer(to: string, amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.transfer(to, amount)
  }

  async approve(spender: string, amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.approve(spender, amount)
  }

  async burn(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) throw new Error('合约未初始化')
    return await this.contract.burn(amount)
  }
}

// 全局实例
export const web3 = new Web3Connection()

// 声明 window.ethereum 类型
declare global {
  interface Window {
    ethereum?: any
  }
}