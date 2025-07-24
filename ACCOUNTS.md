# 固定测试账户配置

## 账户信息

以下是项目中配置的 5 个固定测试账户，每次启动本地网络时都会使用相同的私钥和地址：

### Account #0 (部署者/拥有者)
- **地址**: `0x046920eA6a13de8803b7E8F8b083C78b8c20F574`
- **私钥**: `0xb19daf72248a2e72a0ff84792a2e9c94e1ef39609ce26775ed9e798ab4e12bbe`
- **余额**: 10,000 ETH
- **角色**: 合约部署者和拥有者

### Account #1
- **地址**: `0x9a50d64089AD709f59010A5cBC95cDE8c73cF9a4`
- **私钥**: `0x1ded4084fc64fde1db74faed2cb51dcd8a25466d5f8fe62f4c19ec97491c2e34`
- **余额**: 10,000 ETH

### Account #2
- **地址**: `0x1aE21F59938F40b15683d4788009B8f8F2759b3f`
- **私钥**: `0x60aadbd422ed22966f6c5a448387dcac5447124efdf54051b320be90def598ba`
- **余额**: 10,000 ETH

### Account #3
- **地址**: `0x3caEAA1fd8c77B0c644b2cCB96373ED6CC2E4538`
- **私钥**: `0x36cbcd91de7441e5d6a232d6febaa03d16cf0b116f1f0b02080bff6beabe4e63`
- **余额**: 10,000 ETH

### Account #4
- **地址**: `0x1572A16A58DED75E24A40067Ba405474Ef1b9Cf4`
- **私钥**: `0xcb6512306d9253177791c84f24b5b341c81271d91286d03b9fadf7ddfde2798a`
- **余额**: 10,000 ETH

## 合约地址

### MyToken 合约
- **地址**: `0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67`
- **部署者**: Account #0 (nonce 0)

## MetaMask 配置

### 网络设置
- **网络名称**: Localhost 8545
- **RPC URL**: http://localhost:8545
- **链ID**: 31337
- **货币符号**: ETH

### 导入账户到 MetaMask

1. 打开 MetaMask
2. 点击右上角的账户图标
3. 选择"导入账户"
4. 选择"私钥"
5. 粘贴上述任一私钥即可导入对应账户

## 使用说明

1. **启动本地网络**：
   ```bash
   npx hardhat node
   ```
   
2. **部署合约**：
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   或者使用 ignition：
   ```bash
   npx hardhat ignition deploy ignition/modules/MyToken.js --network localhost
   ```

3. **重置状态**：
   如果需要重置所有状态（包括合约），停止节点并重新启动即可。账户地址和合约地址将保持不变。

## 注意事项

- 这些私钥仅用于本地测试，**切勿在主网或测试网上使用**
- 每次重启 `hardhat node` 时，所有账户余额都会重置为 10,000 ETH
- 合约地址基于固定的部署者地址和 nonce 计算，确保每次部署都是相同地址
- 如果需要修改账户，请同时更新 `hardhat.config.js` 中的配置

## 私钥生成说明

这些私钥是通过加密安全的随机数生成器生成的：
- 使用 Node.js 的 `crypto.randomBytes(32)` 生成 32 字节随机数
- 转换为十六进制格式并添加 '0x' 前缀
- 每个私钥都对应一个唯一的以太坊地址
- 所有私钥都符合 ECDSA secp256k1 标准

## 快速导入脚本

可以使用以下命令快速查看所有账户信息：
```bash
npx hardhat console --network localhost
```

然后在控制台中运行：
```javascript
const accounts = await ethers.getSigners();
for (let i = 0; i < accounts.length; i++) {
  console.log(`Account ${i}: ${accounts[i].address}`);
}
```