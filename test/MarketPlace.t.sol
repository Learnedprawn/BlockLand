//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {LandStructs} from "../src/utils/LandDataStruct.sol";
import {SingleOwnerNFT} from "../src/SingleOwnerNFT.sol";
import {MarketPlace} from "../src/MarketPlace.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract TestMarketPlace is Test {

    MarketPlace marketPlace;
    function setUp() public {
        address singleOwnerNFT = DevOpsTools.get_most_recent_deployment("SingleOwnerNFT", block.chainid);
        marketPlace = new MarketPlace(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, singleOwnerNFT);
    }


}

