require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: [
        // 固定的5个测试账户私钥
        '0xb19daf72248a2e72a0ff84792a2e9c94e1ef39609ce26775ed9e798ab4e12bbe', // Account #0 - 0x046920eA6a13de8803b7E8F8b083C78b8c20F574
        '0x1ded4084fc64fde1db74faed2cb51dcd8a25466d5f8fe62f4c19ec97491c2e34', // Account #1 - 0x9a50d64089AD709f59010A5cBC95cDE8c73cF9a4
        '0x60aadbd422ed22966f6c5a448387dcac5447124efdf54051b320be90def598ba', // Account #2 - 0x1aE21F59938F40b15683d4788009B8f8F2759b3f
        '0x36cbcd91de7441e5d6a232d6febaa03d16cf0b116f1f0b02080bff6beabe4e63', // Account #3 - 0x3caEAA1fd8c77B0c644b2cCB96373ED6CC2E4538
        '0xcb6512306d9253177791c84f24b5b341c81271d91286d03b9fadf7ddfde2798a', // Account #4 - 0x1572A16A58DED75E24A40067Ba405474Ef1b9Cf4
      ],
    },
    hardhat: {
      accounts: [
        {
          privateKey: '0xb19daf72248a2e72a0ff84792a2e9c94e1ef39609ce26775ed9e798ab4e12bbe',
          balance: '10000000000000000000000', // 10000 ETH
        },
        {
          privateKey: '0x1ded4084fc64fde1db74faed2cb51dcd8a25466d5f8fe62f4c19ec97491c2e34',
          balance: '10000000000000000000000', // 10000 ETH
        },
        {
          privateKey: '0x60aadbd422ed22966f6c5a448387dcac5447124efdf54051b320be90def598ba',
          balance: '10000000000000000000000', // 10000 ETH
        },
        {
          privateKey: '0x36cbcd91de7441e5d6a232d6febaa03d16cf0b116f1f0b02080bff6beabe4e63',
          balance: '10000000000000000000000', // 10000 ETH
        },
        {
          privateKey: '0xcb6512306d9253177791c84f24b5b341c81271d91286d03b9fadf7ddfde2798a',
          balance: '10000000000000000000000', // 10000 ETH
        },
      ],
    },
  },
};
