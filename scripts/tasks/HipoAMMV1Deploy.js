const fs = require("fs");
const HipoAMMV1Constructor = require("../configuration/HipoAMMV1Constructor.json");
const InterestTokenAddress = require("../initialization/InterestTokenDeploy.json");
const config = require("../initialization/config.json");

task('HipoAMMV1Deploy', 'Deploy Hipo AMM(V1)')
  .setAction(async() => {

    let Pairs = []
    
    const [deployer] = await ethers.getSigners();
    console.log(`Hipo AMM(V1) Owner is ${deployer.address}`);

    const HipoAMMV1Factory = await ethers.getContractFactory('HipoAMMV1Factory');
    const hardhatHipoAMMV1Factory = await HipoAMMV1Factory.deploy(deployer.address);

    const factory = {
      contract: "HipoAMMV1Factory",
      address: hardhatHipoAMMV1Factory.address
    };

    const WETHAddress = HipoAMMV1Constructor.WETH.address;
    console.log("WETH Address is ", WETHAddress);

    const FinancingPoolAddress = HipoAMMV1Constructor.FinancingPool.address;
    console.log("FinancingPoolAddress is ", FinancingPoolAddress);

    const HipoAMMV1Router02 = await ethers.getContractFactory('HipoAMMV1Router02');
    const hardhatHipoAMMV1Router02 = await HipoAMMV1Router02.deploy(
      hardhatHipoAMMV1Factory.address,
      WETHAddress, 
      FinancingPoolAddress
    )

    const router02 = {
      contract: "HipoAMMV1Router02",
      address: hardhatHipoAMMV1Router02.address
    }

    const interestTokenAddress = InterestTokenAddress.InterestToken;
    
    for (i = 0; i < interestTokenAddress.length; i++) {
      
      console.log("Index is :", i);
      const asset = config.assets[i].asset;

      let assetAddress

      if(asset === "WETH") {
        assetAddress = config.WETH.address
      }

      if(asset === "USDT") {
        assetAddress = config.USDT.address
      }

      if(asset === "USDC") {
        assetAddress = config.USDC.address
      }

      if(asset === "DAI") {
        assetAddress = config.DAI.address
      }

      console.log("Asset Address is: ", assetAddress);
      console.log("Interest Address is:", interestTokenAddress[i].address);
      await hardhatHipoAMMV1Factory.createPair(interestTokenAddress[i].address, assetAddress)

      const pairAddress = await hardhatHipoAMMV1Factory.getPair(interestTokenAddress[i].address, assetAddress)
      console.log("Pair address is:", pairAddress);

      Pairs[i] = {
        indexOfNumber: i,
        interestTokenAddress: interestTokenAddress[i].address,
        assetAddress: assetAddress,
        pairAddress: pairAddress,
      }
    }

    // await interestTokenAddress.forEach(
    //   token => {
    //     const index = token.indexOfNumber
    //     console.log(index);
    //     const asset = config.assets[index].asset;

    //     let assetAddress

    //     if(asset === "WETH") {
    //       assetAddress = config.WETH.address
    //     }

    //     if(asset === "USDT") {
    //       assetAddress = config.USDT.address
    //     }

    //     if(asset === "USDC") {
    //       assetAddress = config.USDC.address
    //     }

    //     if(asset === "DAI") {
    //       assetAddress = config.DAI.address
    //     }

    //     console.log(assetAddress);
    //     hardhatHipoAMMV1Factory.createPair(token.address, assetAddress)

    //     const pairAddress = hardhatHipoAMMV1Factory.getPair(token.address, assetAddress)
    //     console.log(pairAddress);

    //     const allPairsAddress = hardhatHipoAMMV1Factory.allPairs()
    //     console.log(allPairsAddress);
    //   })

    const factoryData = {
      HipoAMMV1Factory: factory
    };

    const router02Data = {
      HipoAMMV1Router02: router02
    };

    const pairsData = {
      pairs: Pairs
    }

    fs.writeFileSync('./scripts/initialization/HipoAMMV1FactoryDeploy.json', JSON.stringify(factoryData));
    fs.writeFileSync('./scripts/initialization/HipoAMMV1Router02Deploy.json', JSON.stringify(router02Data));
    fs.writeFileSync('./scripts/initialization/HipoAMMV1Pairs.json', JSON.stringify(pairsData));

  });

module.exports = {}