// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {LandRegistry} from "../src/LandRegistry.sol";

contract DeployLandRegistry is Script {
    LandRegistry public landRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        landRegistry = new LandRegistry(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);

        vm.stopBroadcast();
    }
}
