//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {LandStructs} from "../src/utils/LandDataStruct.sol";
import {SingleOwnerNFT} from "../src/SingleOwnerNFT.sol";


contract TestNFT is Test {

    address NFTOwner = makeAddr("NFT");
    SingleOwnerNFT nftMinter;

    function setUp() public {

         nftMinter = new SingleOwnerNFT();

    }

    function test_mintNFT() public {
        LandStructs.LandData memory landData = LandStructs.LandData({
        ownerName: "Vinesh",
        landAddress: "Ulwe",
        ownershipHistoryHash: "anything",
        legalDocumentsHash: "anything",
        owner: NFTOwner,
        share: 1,
        price: 1
        });
        vm.prank(NFTOwner);
        uint256 tokenId = nftMinter.mintNft(landData);

        assertEq(nftMinter.ownerOf(tokenId), NFTOwner);
    }
}