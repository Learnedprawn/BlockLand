// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {NFTGeneration} from "../src/NFTGeneration.sol";
import {LandERC20} from "../src/LandERC20.sol";
import {LandStructs} from "../src/utils/LandDataStruct.sol";

contract DeployLandERC20 is Script {
    function run() external {
        vm.startBroadcast(); // Start broadcasting transactions
        vm.stopBroadcast(); // Stop broadcasting transactions
    }
}
