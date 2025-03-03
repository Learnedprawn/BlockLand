// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Enrollment} from "../src/Enrollment.sol";

contract CounterScript is Script {
    Enrollment public enrollment;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        enrollment = new Enrollment();

        vm.stopBroadcast();
    }
}
