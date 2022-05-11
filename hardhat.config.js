require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('./scripts/tasks/HipoAMMV1Deploy.js')

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs:200,
          },
          evmVersion: "istanbul"
        }
      },
      {
        version:"0.5.16",
        settings: {
          optimizer: {
            enabled:true,
            runs:200,
          },
          evmVersion: "istanbul"
        }
      },
    ],
  }
};