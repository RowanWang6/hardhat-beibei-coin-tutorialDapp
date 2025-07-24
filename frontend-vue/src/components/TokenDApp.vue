<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-xl">₿</span>
        </div>
        <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          BeiBei Coin
        </h1>
      </div>
      <p class="text-xl text-gray-300 mb-8">
        BeiBeiCoin (BBC) 代币交互界面 - Vue + Ethers.js v6
      </p>

      <!-- Connect Button -->
      <div class="flex justify-center mb-6">
        <button 
          v-if="!isConnected"
          @click="connect"
          :disabled="isConnecting"
          class="btn-primary px-8 py-3 text-lg"
        >
          {{ isConnecting ? '连接中...' : '连接钱包' }}
        </button>
        <div v-else class="space-y-2">
          <div class="text-green-400 font-semibold">
            已连接: {{ account.slice(0, 6) }}...{{ account.slice(-4) }}
          </div>
          <button @click="disconnect" class="btn-secondary">
            断开连接
          </button>
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="isConnected" class="mt-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold">调试信息:</h3>
          <div class="space-x-2">
            <button @click="refreshData" class="px-3 py-1 bg-blue-500 text-white rounded text-xs">
              刷新数据
            </button>
          </div>
        </div>
        <div class="text-left space-y-1">
          <div>当前地址: {{ account }}</div>
          <div>当前网络: {{ chainId }} {{ isCorrectNetwork ? '✅' : '❌ (需要31337)' }}</div>
          <div>合约所有者: {{ owner || '未获取到' }}</div>
          <div>合约地址: {{ CONTRACT_ADDRESS }}</div>
          <div>是否为所有者: {{ isOwner ? '是' : '否' }}</div>
          <div v-if="!isCorrectNetwork" class="mt-2">
            <button @click="switchToHardhat" class="px-3 py-1 bg-red-500 text-white rounded text-xs">
              切换到 Hardhat 网络
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="statusMessage" class="mb-8">
      <StatusMessage :message="statusMessage" :type="statusType" />
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-8">
      <StatusMessage :message="error" type="error" />
    </div>

    <!-- Main Content -->
    <div v-if="!isConnected" class="text-center py-16">
      <div class="card max-w-md mx-auto">
        <h2 class="text-2xl font-semibold mb-4 text-white">
          欢迎使用 BeiBeiCoin DApp
        </h2>
        <p class="text-gray-300 mb-6">请连接您的钱包开始使用</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Token Info -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">₿</span>
          </div>
          <h2 class="text-xl font-semibold text-white">代币信息</h2>
        </div>

        <div class="space-y-4">
          <div class="balance-display">
            <h3 class="text-sm font-medium text-gray-300 mb-2">我的余额</h3>
            <div class="balance-value">
              {{ formatEther(userBalance) }} BBC
            </div>
          </div>

          <div class="balance-display">
            <h3 class="text-sm font-medium text-gray-300 mb-2">总供应量</h3>
            <div class="balance-value">
              {{ formatEther(totalSupply) }} BBC
            </div>
          </div>

          <button @click="refreshData" :disabled="isLoading" class="btn-secondary w-full">
            {{ isLoading ? '刷新中...' : '刷新余额' }}
          </button>
        </div>
      </div>

      <!-- Mint Tokens (Owner Only) -->
      <div v-if="isOwner" class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">⚡</span>
          </div>
          <h2 class="text-xl font-semibold text-white">铸造代币</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">接收地址:</label>
            <input
              v-model="mintForm.to"
              type="text"
              placeholder="0x..."
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">铸造数量:</label>
            <input
              v-model="mintForm.amount"
              type="number"
              placeholder="输入数量"
              class="input-field"
            />
          </div>

          <button
            @click="handleMint"
            :disabled="isLoading || !mintForm.to || !mintForm.amount"
            class="btn-primary w-full"
          >
            {{ isLoading ? '处理中...' : '铸造代币' }}
          </button>
        </div>
      </div>

      <!-- Transfer -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
          <h2 class="text-xl font-semibold text-white">转账</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">接收地址:</label>
            <input
              v-model="transferForm.to"
              type="text"
              placeholder="0x..."
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">转账数量:</label>
            <input
              v-model="transferForm.amount"
              type="number"
              placeholder="输入数量"
              class="input-field"
            />
          </div>

          <button
            @click="handleTransfer"
            :disabled="isLoading || !transferForm.to || !transferForm.amount"
            class="btn-primary w-full"
          >
            {{ isLoading ? '处理中...' : '转账' }}
          </button>
        </div>
      </div>

      <!-- Approve -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">🛡</span>
          </div>
          <h2 class="text-xl font-semibold text-white">授权</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">授权地址:</label>
            <input
              v-model="approveForm.spender"
              type="text"
              placeholder="0x..."
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">授权数量:</label>
            <input
              v-model="approveForm.amount"
              type="number"
              placeholder="输入数量"
              class="input-field"
            />
          </div>

          <button
            @click="handleApprove"
            :disabled="isLoading || !approveForm.spender || !approveForm.amount"
            class="btn-primary w-full"
          >
            {{ isLoading ? '处理中...' : '授权' }}
          </button>
        </div>
      </div>

      <!-- Burn -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">🔥</span>
          </div>
          <h2 class="text-xl font-semibold text-white">销毁代币</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">销毁数量:</label>
            <input
              v-model="burnForm.amount"
              type="number"
              placeholder="输入数量"
              class="input-field"
            />
          </div>

          <button
            @click="handleBurn"
            :disabled="isLoading || !burnForm.amount"
            class="btn-primary w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            {{ isLoading ? '处理中...' : '销毁代币' }}
          </button>
        </div>
      </div>

      <!-- Query Balance -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">🔍</span>
          </div>
          <h2 class="text-xl font-semibold text-white">查询功能</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">查询地址余额:</label>
            <input
              v-model="queryForm.address"
              type="text"
              placeholder="0x..."
              class="input-field"
            />
          </div>

          <button
            @click="handleQuery"
            :disabled="isLoading || !queryForm.address"
            class="btn-secondary w-full"
          >
            {{ isLoading ? '查询中...' : '查询余额' }}
          </button>

          <div v-if="queryResult !== null" class="balance-display">
            <h3 class="text-sm font-medium text-gray-300 mb-2">查询结果</h3>
            <div class="balance-value">
              {{ formatEther(queryResult) }} BBC
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { useWeb3 } from '@/composables/useWeb3'
import { CONTRACT_ADDRESS } from '@/utils/web3'
import StatusMessage from './StatusMessage.vue'

// 使用Web3 composable
const {
  account,
  chainId,
  isConnected,
  isConnecting,
  userBalance,
  totalSupply,
  owner,
  error,
  isOwner,
  isCorrectNetwork,
  connect,
  disconnect,
  switchToHardhat,
  refreshData,
  mint,
  transfer,
  approve,
  burn,
  queryBalance
} = useWeb3()

// 本地状态
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'warning'>('success')
const queryResult = ref<bigint | null>(null)

// 表单数据
const mintForm = ref({ to: '', amount: '' })
const transferForm = ref({ to: '', amount: '' })
const approveForm = ref({ spender: '', amount: '' })
const burnForm = ref({ amount: '' })
const queryForm = ref({ address: '' })

// 工具函数
const formatEther = (value: bigint) => {
  return ethers.formatEther(value)
}

const showStatus = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// 操作处理函数
const handleMint = async () => {
  if (!mintForm.value.to || !mintForm.value.amount) return
  
  isLoading.value = true
  try {
    await mint(mintForm.value.to, mintForm.value.amount)
    showStatus('铸造成功！', 'success')
    mintForm.value = { to: '', amount: '' }
  } catch (err: any) {
    showStatus(err.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleTransfer = async () => {
  if (!transferForm.value.to || !transferForm.value.amount) return
  
  isLoading.value = true
  try {
    await transfer(transferForm.value.to, transferForm.value.amount)
    showStatus('转账成功！', 'success')
    transferForm.value = { to: '', amount: '' }
  } catch (err: any) {
    showStatus(err.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleApprove = async () => {
  if (!approveForm.value.spender || !approveForm.value.amount) return
  
  isLoading.value = true
  try {
    await approve(approveForm.value.spender, approveForm.value.amount)
    showStatus('授权成功！', 'success')
    approveForm.value = { spender: '', amount: '' }
  } catch (err: any) {
    showStatus(err.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleBurn = async () => {
  if (!burnForm.value.amount) return
  
  isLoading.value = true
  try {
    await burn(burnForm.value.amount)
    showStatus('销毁成功！', 'success')
    burnForm.value = { amount: '' }
  } catch (err: any) {
    showStatus(err.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleQuery = async () => {
  if (!queryForm.value.address) return
  
  isLoading.value = true
  try {
    const balance = await queryBalance(queryForm.value.address)
    queryResult.value = balance
    showStatus('查询成功！', 'success')
  } catch (err: any) {
    showStatus(err.message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>