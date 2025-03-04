// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import {Script} from "forge-std/Script.sol";
// import {MarketPlace} from "../src/MarketPlace.sol";

// contract DeployMarketPlace is Script {
//     function run() external {
//         address govOfficial = vm.envAddress("GOVERNMENT_OFFICIAL");
//         address nftGeneration = vm.envAddress("NFT_GENERATION");

//         vm.startBroadcast();
//         MarketPlace marketplace = new MarketPlace(govOfficial, nftGeneration);
//         vm.stopBroadcast();

//         // console.log("MarketPlace deployed at:", address(marketplace));
//     }
// }
