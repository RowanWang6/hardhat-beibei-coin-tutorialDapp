# BeiBeiCoin (BBC) DApp 🪙

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://reactjs.org/)
[![Vue](https://img.shields.io/badge/Frontend-Vue%203-green.svg)](https://vuejs.org/)
[![Ethers](https://img.shields.io/badge/Web3-Ethers.js%20v6-purple.svg)](https://docs.ethers.org/)

👆 [Click here for English documentation](./README_EN.md)

> 一个功能完整的 ERC-20 代币 DApp，提供铸造、转账、授权、销毁等功能，支持 React 和 Vue 两个前端版本

## 📖 项目简介

BeiBeiCoin (BBC) 是一个基于以太坊的 ERC-20 代币项目，提供完整的智能合约和现代化的前端界面。项目包含：

- **智能合约**: 基于 Solidity 的 ERC-20 代币合约，支持铸造和销毁功能
- **React 前端**: 使用 React 19 + RainbowKit + Wagmi v2 构建的现代化 Web3 界面
- **Vue 前端**: 使用 Vue 3 + ethers.js v6 构建的原生 Web3 连接界面
- **本地开发**: 完整的 Hardhat 开发环境配置

<!-- 项目演示截图占位符 -->

## 🖼️ 项目截图

- 主页面

[![](./docs/images/react-dashboard.png)](https://github.com/your-username/hardhat-project)

- 代币操作界面

[![](./docs/images/token-operations.png)](https://github.com/your-username/hardhat-project)

## ✨ 主要特性

### 🔒 智能合约功能

- ✅ 标准 ERC-20 代币实现
- ✅ 所有者权限的代币铸造
- ✅ 代币销毁功能
- ✅ 转账和授权机制
- ✅ 完整的事件日志

### 🎨 前端特性

- ✅ 双前端支持（React + Vue）
- ✅ 现代化响应式 UI 设计
- ✅ 实时余额更新
- ✅ 完整的错误处理
- ✅ 网络自动检测和切换
- ✅ 交易状态跟踪

### 🛠️ 开发工具

- ✅ Hardhat 本地开发网络
- ✅ 自动化测试套件
- ✅ 合约部署脚本
- ✅ TypeScript 支持
- ✅ 热重载开发环境

## 🏗️ 技术架构

### 智能合约层

```
MyToken.sol (ERC-20)
├── 铸造功能 (仅所有者)
├── 转账功能
├── 授权机制
├── 销毁功能
└── 余额查询
```

### React

```
React 19 + TypeScript
├── RainbowKit (钱包连接)
├── Wagmi v2 (Web3 Hooks)
├── Viem (以太坊客户端)
├── TanStack Query (数据获取)
├── Tailwind CSS (样式)
└── Lucide React (图标)
```

### Vue

```
Vue 3.5.17 + TypeScript
├── ethers.js v6.15.0 (Web3库)
├── BrowserProvider (钱包连接)
├── Vite 6.x (构建工具)
├── Tailwind CSS (样式)
└── Composition API (状态管理)
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- MetaMask 钱包扩展

### 1. 克隆项目

```bash
git clone <repository-url>
cd hardhat-project
```

### 2. 安装依赖

```bash
# 安装主项目依赖
npm install

# 安装 React 前端依赖
cd frontend-react
npm install
cd ..

# 安装 Vue 前端依赖
cd frontend-vue
npm install
cd ..
```

### 3. 启动本地区块链

```bash
# 启动 Hardhat 本地网络 (保持运行)
npx hardhat node
```

### 4. 部署智能合约

```bash
# 新开终端，部署合约到本地网络
npx hardhat run scripts/fixed-addr-deploy-and-test.js --network localhost
```

### 5. 配置 MetaMask

1. 添加本地网络:

   - 网络名称: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - 链 ID: `31337`
   - 货币符号: `ETH`

2. 导入测试账户 (查看 `ACCOUNTS.md` 获取私钥)

### 6. 启动前端应用

#### React 版本

```bash
cd frontend-react
npm run dev
```

访问: http://localhost:5173

**React 版本特点:**

- 🎨 现代化 UI 设计
- 🔗 RainbowKit 钱包连接
- ⚡ Wagmi v2 高性能 Hooks
- 🔄 实时数据同步
- 📱 完美响应式设计

#### Vue 版本

```bash
cd frontend-vue
npm run dev
```

访问: http://localhost:5174

**Vue 版本特点:**

- 🛠️ 原生 ethers.js v6 集成
- 🔧 BrowserProvider 直连
- 🐛 经过调试修复的稳定版本
- 💡 Composition API 状态管理
- 🎯 专注核心 Web3 功能

## 📚 使用指南

### 连接钱包

1. 点击 "连接钱包" 按钮
2. 选择 MetaMask
3. 确认连接并切换到 Hardhat 本地网络

### 代币操作

#### 🪙 铸造代币 (仅合约所有者)

1. 输入接收地址
2. 输入铸造数量
3. 点击 "铸造代币"
4. 在 MetaMask 中确认交易

#### 💸 转账代币

1. 输入接收地址
2. 输入转账数量
3. 点击 "转账"
4. 确认交易

#### 🛡️ 授权代币

1. 输入被授权地址
2. 输入授权数量
3. 点击 "授权"
4. 确认交易

#### 🔥 销毁代币

1. 输入销毁数量
2. 点击 "销毁代币"
3. 确认交易

#### 🔍 查询余额

1. 输入要查询的地址
2. 点击 "查询余额"
3. 查看结果

## 🧪 测试与开发

### 运行测试

```bash
# 运行智能合约测试
npx hardhat test

# 运行特定测试文件
npx hardhat test test/MyTokenTest.js
```

### 重新部署合约

注意：本项目前端需要使用每次固定的合约地址，推荐使用 `fixed-addr-deploy-and-test.js` 脚本避免需要在前端修改连接地址，且每次重新部署合约前，应先停止 hardhat node。

```bash
# 获得固定合约地址的部署 (推荐)
npx hardhat run scripts/fixed-addr-deploy-and-test.js --network localhost

# 标准部署
npx hardhat run scripts/deploy.js --network localhost
```

## 📁 项目结构

```
hardhat-project/
├── contracts/                 # 智能合约
│   └── MyToken.sol            # ERC-20 代币合约
├── scripts/                   # 部署脚本
│   ├── deploy.js              # 标准部署脚本
│   └── fixed-addr-deploy-and-test.js  # 固定地址部署脚本
├── test/                      # 合约测试
│   └── MyTokenTest.js         # 代币合约测试
├── frontend-react/            # React 前端
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── config/           # Wagmi 配置
│   │   └── ...
│   └── package.json
├── frontend-vue/              # Vue 前端
│   ├── src/
│   │   ├── components/        # Vue 组件
│   │   ├── composables/       # Vue Composables
│   │   ├── utils/            # Web3 工具类
│   │   └── ...
│   └── package.json
├── ignition/                  # Hardhat Ignition 模块
├── ACCOUNTS.md               # 测试账户信息
├── TROUBLESHOOTING.md        # 故障排除指南
├── CLAUDE.md                 # 项目开发记录
└── README.md                 # 项目文档
```

## ⚠️ 故障排除

### 常见问题

#### 1. MetaMask 连接失败

```bash
# 解决方案
1. 确保 MetaMask 已安装并解锁
2. 检查网络配置是否正确 (localhost:8545, 链ID: 31337)
3. 清除 MetaMask 缓存并重新连接（重启浏览器，强制清理缓存似乎没有作用）
```

#### 2. 合约交互失败

```bash
# 解决方案
1. 确认 Hardhat 网络正在运行
2. 检查合约是否正确部署
3. 验证账户有足够的 ETH 支付 Gas
```

#### 3. Vue 版本 ethers.js 问题

```bash
# 已修复的问题
1. ❌ Cannot read private member #notReady
   ✅ 使用 BrowserProvider 替代 provider.ready

2. ❌ 合约函数调用失败
   ✅ 使用标准 ERC20 函数名 (balanceOf, totalSupply)
```

详细的故障排除指南请查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 🔧 配置说明

### 合约配置

- **合约地址**: `0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67` (固定地址)
- **代币名称**: `BeiBeiCoin`
- **代币符号**: `BBC`
- **小数位数**: `18`
- **网络**: Hardhat Local (Chain ID: 31337)

### 网络配置

```javascript
// hardhat.config.js
networks: {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337
  }
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 代码规范
- 编写完整的单元测试
- 更新相关文档

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [OpenZeppelin](https://openzeppelin.com/) - 智能合约库
- [ethers.js](https://docs.ethers.org/) - 以太坊 JavaScript 库
- [RainbowKit](https://www.rainbowkit.com/) - React Web3 连接组件
- [Wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 📞 联系方式

如有问题或建议，请：

1. 提交 [Issue](../../issues)
2. 发起 [Discussion](../../discussions)
3. 创建 [Pull Request](../../pulls)

---

**⭐ 如果这个项目对您有帮助，请给个 Star！**

---
