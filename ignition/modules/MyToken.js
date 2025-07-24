import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('MyTokenModule', m => {
  // 使用固定的部署参数确保地址一致
  const myToken = m.contract('MyToken', [], {
    id: 'MyToken_Fixed', // 固定的部署ID
  });

  return { myToken };
});