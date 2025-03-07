//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {SingleOwnerNFT} from "../src/SingleOwnerNFT.sol";
import {LandStructs} from "../src/utils/LandDataStruct.sol";

contract DeploySingleOwnerNFT is Script {
    function run() public {
        vm.startBroadcast();
        new SingleOwnerNFT();
        mintNFT();
        vm.stopBroadcast();
    }

    function mintNFT() public {
        address nftOwner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        LandStructs.LandData memory landData = LandStructs.LandData({
        ownerName: "Vinesh",
        landAddress: "Ulwe",
        ownershipHistoryHash: "anything",
        legalDocumentsHash: "anything",
        owner: nftOwner,
        share: 1,
        price: 1
        });
        SingleOwnerNFT nftMinter = new SingleOwnerNFT();
        nftMinter.mintNft(landData);
    }
}