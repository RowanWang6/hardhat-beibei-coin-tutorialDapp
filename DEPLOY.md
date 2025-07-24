# 固定配置部署脚本

这些脚本帮助您快速部署和测试固定地址的合约。

## 快速部署
```bash
# 1. 启动本地网络
npx hardhat node

# 2. 部署合约（新终端）
npx hardhat run scripts/deploy.js --network localhost
```

## 验证部署
```bash
# 查看部署的合约地址
npx hardhat console --network localhost

# 在控制台中运行
const MyToken = await ethers.getContractFactory("MyToken");
const myToken = MyToken.attach("0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67");
console.log("合约名称:", await myToken.name());
console.log("合约符号:", await myToken.symbol());
console.log("合约拥有者:", await myToken.owner());
```

## 重置环境
如果需要完全重置：
1. 停止 `hardhat node`
2. 删除 `cache` 和 `artifacts` 目录
3. 重新启动 `hardhat node`
4. 重新部署合约

合约地址将保持：`0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67`