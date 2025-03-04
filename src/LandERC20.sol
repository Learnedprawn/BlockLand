// //SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import {LandStructs} from "./utils/LandDataStruct.sol";
// import {NFTGeneration} from "./NFTGeneration.sol";

// contract LandERC20 is ERC20 {
//     error LandERC20__InsufficientShares();

//     uint256 public constant LIMIT = 100;

//     LandStructs.LandData public landData;
//     NFTGeneration public immutable nftGeneration;
//     uint256 public immutable tokenId;

//     constructor(LandStructs.LandData memory _landData, NFTGeneration _NFTGeneration, uint256 _tokenId)
//         ERC20("LandShares", "LS")
//     {
//         landData = _landData;
//         nftGeneration = _NFTGeneration;
//         tokenId = _tokenId;
//         _distributeTokens();
//     }

//     /*
//       * @notice Assuming that shares are in percentage format.            
//     */
//     function _calculateTotalShares() public view returns (uint256) {
//         uint256 _totalShares = 0;
//         for (uint256 i = 0; i < landData.owners.length; i++) {
//             _totalShares += landData.shares[i];
//         }
//         return _totalShares;
//     }

//     function _distributeTokens() internal {
//         for (uint256 i = 0; i < landData.owners.length; i++) {
//             _mint(landData.owners[i], (landData.shares[i]));
//         }
//     }

//     function buyOut() public {
//         if (balanceOf(msg.sender) >= _calculateTotalShares()) {
//             revert LandERC20__InsufficientShares();
//         }
//         nftGeneration.safeTransferFrom(address(this), msg.sender, tokenId);
//     }
// }
