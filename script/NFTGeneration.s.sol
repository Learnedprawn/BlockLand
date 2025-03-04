// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import {Script, console} from "forge-std/Script.sol";
// import {NFTGeneration} from "../src/NFTGeneration.sol";
// import {LandERC20} from "../src/LandERC20.sol";
// import {LandStructs} from "../src/utils/LandDataStruct.sol";

// contract DeployNFTGeneration is Script {
//     function run() external returns (address) {
//         address nftGenerationAddress = deployNFTGeneration();
//         return nftGenerationAddress;
//     }

//     function deployNFTGeneration() public returns (address) {
//         vm.startBroadcast(); // Start broadcasting transactions

//         // Step 2: Deploy NFTGeneration
//         NFTGeneration nftGeneration = new NFTGeneration();

//         console.log("NFTGeneration deployed at:", address(nftGeneration));

//         vm.stopBroadcast(); // Stop broadcasting transactions
//         return address(nftGeneration);
//     }
// }
