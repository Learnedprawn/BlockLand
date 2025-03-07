// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {MarketPlace} from "../src/MarketPlace.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract DeployMarketPlace is Script {
    function run() external {

        address singleOwnerNFT = DevOpsTools.get_most_recent_deployment("SingleOwnerNFT", block.chainid);
        vm.startBroadcast();
        MarketPlace marketplace = new MarketPlace(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, singleOwnerNFT);
        vm.stopBroadcast();

    }
}
