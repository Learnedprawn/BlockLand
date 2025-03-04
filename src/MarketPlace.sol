// //SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import {NFTGeneration} from "./NFTGeneration.sol";
// import {NFTMarketplaceEscrow} from "./EscrowLogic.sol";
// import {LandStructs} from "./utils/LandDataStruct.sol";

// contract MarketPlace is NFTMarketplaceEscrow {
//     mapping(uint256 tokenId => bool sellState) public s_tokenIdToSellState;

//     NFTGeneration public nftGeneration;

//     constructor(address _govOfficial, address _nftGeneration) NFTMarketplaceEscrow(_govOfficial) {
//         nftGeneration = NFTGeneration(_nftGeneration);
//     }

//     function addLandToMarketPlace(uint256 tokenId) public {
//         LandStructs.LandData memory landData = nftGeneration.getLandData(tokenId);
//         s_tokenIdToSellState[tokenId] = true;
//         nftGeneration.approve(address(this), tokenId);
//         // nftGeneration.setApprovalForAll(address(this), true);
//         _createEscrow(msg.sender, address(nftGeneration), tokenId, landData.price);
//     }

//     function removeLandFromMarketPlace(uint256 _escrowId, uint256 tokenId) public {
//         s_tokenIdToSellState[tokenId] = false;
//         _cancelEscrow(_escrowId);
//     }
// }
