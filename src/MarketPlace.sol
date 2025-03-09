//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {SingleOwnerNFT} from "./SingleOwnerNFT.sol";
import {NFTMarketplaceEscrow} from "./EscrowLogic.sol";
import {LandStructs} from "./utils/LandDataStruct.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketPlace is NFTMarketplaceEscrow {
    mapping(uint256 tokenId => uint256 escrowId) public s_tokenIdToSellState;

    SingleOwnerNFT public nftGeneration;

    constructor(address _govOfficial, address _singleNftOwner) NFTMarketplaceEscrow(_govOfficial) {
        nftGeneration = SingleOwnerNFT(_singleNftOwner);
    }

    function addLandToMarketPlace(uint256 tokenId, address buyer) public {
        LandStructs.LandData memory landData = nftGeneration.getLandData(tokenId);
        // s_tokenIdToSellState[tokenId] = true;
        nftGeneration.approve(address(this), tokenId);
        // nftGeneration.setApprovalForAll(address(this), true);
        uint256 escrowId = _createEscrow(buyer, address(nftGeneration), tokenId, landData.price);
        s_tokenIdToSellState[tokenId] = escrowId;

    }

    // function removeLandFromMarketPlace(uint256 _escrowId, uint256 tokenId) public {
    //     s_tokenIdToSellState[tokenId] = 0;
    //     _cancelEscrow(_escrowId);
    // }

        function executeTransaction(uint256 tokenId) external payable {
        // LandStructs.LandData memory landData = nftGeneration.getLandData(tokenId);
        uint256 _escrowId = s_tokenIdToSellState[tokenId];
        Escrow storage escrow = escrows[_escrowId];
        // require(escrow.approved, "Escrow not approved by government official");
        require(msg.value >= escrow.price, "Insufficient funds sent");
        require(msg.sender == escrow.buyer, "Only the buyer can execute");

        // Transfer NFT to buyer
        IERC721(escrow.nftContract).transferFrom(escrow.seller, escrow.buyer, escrow.tokenId);

        // Transfer funds to seller
        payable(escrow.seller).transfer(escrow.price);

        emit TransactionExecuted(_escrowId);
    }
}
