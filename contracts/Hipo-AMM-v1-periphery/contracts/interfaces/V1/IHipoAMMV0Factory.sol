pragma solidity >=0.5.0;

interface IHipoAMMV0Factory {
    function getExchange(address) external view returns (address);
}
