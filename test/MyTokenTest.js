const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyToken', function () {
  let myToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // 获取测试账户，每次it都会重新获取
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约，每次it都会重新部署
    const MyToken = await ethers.getContractFactory('MyToken');
    myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
  });

  describe('部署', function () {
    it('应该设置正确的代币名称', async function () {
      expect(await myToken.name()).to.equal('BeiBeiCoin');
    });

    it('应该设置正确的代币符号', async function () {
      expect(await myToken.symbol()).to.equal('BBC');
    });

    it('应该设置正确的小数位数', async function () {
      expect(await myToken.decimals()).to.equal(18);
    });

    it('应该设置正确的拥有者', async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it('应该设置正确的拥有者名称', async function () {
      expect(await myToken.ownerName()).to.equal('PBB');
    });

    it('初始总供应量应该为0', async function () {
      expect(await myToken.totalSupply()).to.equal(0);
    });
  });

  describe('铸造功能', function () {
    const mintAmount = ethers.parseEther('1000');

    it('拥有者应该能够铸造代币', async function () {
      await myToken.mint(addr1.address, mintAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await myToken.totalSupply()).to.equal(mintAmount);
    });

    it('铸造时应该发出Mint和Transfer事件', async function () {
      await expect(myToken.mint(addr1.address, mintAmount))
        .to.emit(myToken, 'Mint')
        .withArgs(addr1.address, mintAmount)
        .to.emit(myToken, 'Transfer')
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });

    it('非拥有者不应该能够铸造代币', async function () {
      await expect(
        myToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWith('Not owner');
    });

    it('不应该允许向零地址铸造', async function () {
      await expect(
        myToken.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith('Invalid address');
    });

    it('多次铸造应该正确累加总供应量', async function () {
      await myToken.mint(addr1.address, mintAmount);
      await myToken.mint(addr2.address, mintAmount);

      expect(await myToken.totalSupply()).to.equal(mintAmount * 2n);
    });
  });

  describe('转账功能', function () {
    const mintAmount = ethers.parseEther('1000');
    const transferAmount = ethers.parseEther('100');

    beforeEach(async function () {
      // 为addr1铸造代币用于转账测试
      await myToken.mint(addr1.address, mintAmount);
    });

    it('应该能够成功转账', async function () {
      await myToken.connect(addr1).transfer(addr2.address, transferAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(
        mintAmount - transferAmount
      );
      expect(await myToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it('转账应该发出Transfer事件', async function () {
      await expect(myToken.connect(addr1).transfer(addr2.address, transferAmount))
        .to.emit(myToken, 'Transfer')
        .withArgs(addr1.address, addr2.address, transferAmount);
    });

    it('转账函数应该返回true', async function () {
      const result = await myToken
        .connect(addr1)
        .transfer.staticCall(addr2.address, transferAmount);
      expect(result).to.be.true;
    });

    it('余额不足时应该转账失败', async function () {
      const excessiveAmount = ethers.parseEther('2000');

      await expect(
        myToken.connect(addr1).transfer(addr2.address, excessiveAmount)
      ).to.be.revertedWith('Insufficient balance');
    });

    it('不应该允许向零地址转账', async function () {
      await expect(
        myToken.connect(addr1).transfer(ethers.ZeroAddress, transferAmount)
      ).to.be.revertedWith('Invalid address');
    });

    it('转账0代币应该成功', async function () {
      await myToken.connect(addr1).transfer(addr2.address, 0);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await myToken.balanceOf(addr2.address)).to.equal(0);
    });

    it('向自己转账应该成功', async function () {
      await myToken.connect(addr1).transfer(addr1.address, transferAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });
  });

  describe('授权功能', function () {
    const mintAmount = ethers.parseEther('1000');
    const approveAmount = ethers.parseEther('500');
    const transferAmount = ethers.parseEther('100');

    beforeEach(async function () {
      await myToken.mint(addr1.address, mintAmount);
    });

    it('应该能够授权', async function () {
      await myToken.connect(addr1).approve(addr2.address, approveAmount);
      expect(await myToken.allowance(addr1.address, addr2.address)).to.equal(approveAmount);
    });

    it('授权应该发出Approval事件', async function () {
      await expect(myToken.connect(addr1).approve(addr2.address, approveAmount))
        .to.emit(myToken, 'Approval')
        .withArgs(addr1.address, addr2.address, approveAmount);
    });

    it('应该能够使用授权进行转账', async function () {
      await myToken.connect(addr1).approve(addr2.address, approveAmount);
      await myToken.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount - transferAmount);
      expect(await myToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await myToken.allowance(addr1.address, addr2.address)).to.equal(approveAmount - transferAmount);
    });

    it('授权转账应该发出Transfer事件', async function () {
      await myToken.connect(addr1).approve(addr2.address, approveAmount);
      await expect(myToken.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount))
        .to.emit(myToken, 'Transfer')
        .withArgs(addr1.address, addr2.address, transferAmount);
    });

    it('授权不足时应该转账失败', async function () {
      await myToken.connect(addr1).approve(addr2.address, transferAmount);
      await expect(
        myToken.connect(addr2).transferFrom(addr1.address, addr2.address, approveAmount)
      ).to.be.revertedWith('Insufficient allowance');
    });
  });

  describe('销毁功能', function () {
    const mintAmount = ethers.parseEther('1000');
    const burnAmount = ethers.parseEther('100');

    beforeEach(async function () {
      await myToken.mint(addr1.address, mintAmount);
    });

    it('应该能够销毁代币', async function () {
      await myToken.connect(addr1).burn(burnAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount - burnAmount);
      expect(await myToken.totalSupply()).to.equal(mintAmount - burnAmount);
    });

    it('销毁应该发出Burn和Transfer事件', async function () {
      await expect(myToken.connect(addr1).burn(burnAmount))
        .to.emit(myToken, 'Burn')
        .withArgs(addr1.address, burnAmount)
        .to.emit(myToken, 'Transfer')
        .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);
    });

    it('余额不足时应该销毁失败', async function () {
      await expect(
        myToken.connect(addr1).burn(mintAmount + 1n)
      ).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('查询功能', function () {
    const mintAmount = ethers.parseEther('1000');
    const approveAmount = ethers.parseEther('500');

    beforeEach(async function () {
      await myToken.mint(addr1.address, mintAmount);
      await myToken.connect(addr1).approve(addr2.address, approveAmount);
    });

    it('getBalance应该返回正确的余额', async function () {
      expect(await myToken.getBalance(addr1.address)).to.equal(mintAmount);
      expect(await myToken.getBalance(addr2.address)).to.equal(0);
    });

    it('getTotalSupply应该返回正确的总供应量', async function () {
      expect(await myToken.getTotalSupply()).to.equal(mintAmount);
    });

    it('getAllowance应该返回正确的授权额度', async function () {
      expect(await myToken.getAllowance(addr1.address, addr2.address)).to.equal(approveAmount);
    });
  });

  describe('边界情况', function () {
    it('应该处理最大uint256值', async function () {
      const maxUint256 = ethers.MaxUint256;

      await myToken.mint(addr1.address, maxUint256);
      expect(await myToken.balanceOf(addr1.address)).to.equal(maxUint256);
      expect(await myToken.totalSupply()).to.equal(maxUint256);
    });

    it('余额为0的账户不应该能够转账', async function () {
      await expect(
        myToken.connect(addr2).transfer(addr1.address, 1)
      ).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('状态查询', function () {
    const mintAmount = ethers.parseEther('500');

    it('应该正确返回余额', async function () {
      await myToken.mint(addr1.address, mintAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await myToken.balanceOf(addr2.address)).to.equal(0);
    });

    it('应该正确返回总供应量', async function () {
      await myToken.mint(addr1.address, mintAmount);
      await myToken.mint(addr2.address, mintAmount);

      expect(await myToken.totalSupply()).to.equal(mintAmount * 2n);
    });
  });

  describe('访问控制', function () {
    it('只有拥有者才能调用onlyOwner修饰符的函数', async function () {
      const mintAmount = ethers.parseEther('100');

      // 拥有者可以调用
      await expect(myToken.mint(addr1.address, mintAmount)).to.not.be.reverted;

      // 非拥有者不能调用
      await expect(
        myToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWith('Not owner');
    });
  });
});
