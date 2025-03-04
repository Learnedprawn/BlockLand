//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {SingleOwnerNFT} from "../src/SingleOwnerNFT.sol";

contract DeploySingleOwnerNFT is Script {
    function run() public {
        vm.startBroadcast();
        new SingleOwnerNFT();
        vm.stopBroadcast();
    }
}