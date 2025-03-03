// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {LandERC20} from "./LandERC20.sol";
import {LandStructs} from "./utils/LandDataStruct.sol";

contract NFTGeneration is ERC721 {
    error NFTGeneration__TokenUriNotFound();
    error ERC721Metadata__URI_QueryFor_NonExistentToken();

    // mapping(uint256 tokenId => string tokenURI) public s_tokenURIs;
    mapping(uint256 tokenId => LandStructs.LandData landData) public s_tokenIdToState;
    uint256 public s_tokenCounter;

    constructor() ERC721("LandNFT", "LNFT") {
        s_tokenCounter = 0;
    }

    function mintNft(address nftOwner, LandStructs.LandData memory landData) public returns (uint256) {
        if (landData.ownerNames.length == 1) {
            _safeMint(nftOwner, s_tokenCounter);
            s_tokenIdToState[s_tokenCounter] = landData;
            s_tokenCounter = s_tokenCounter + 1;
            return s_tokenCounter - 1;
        }
        else{
            LandERC20 landERC20Instance = new LandERC20(landData, NFTGeneration(address(this)), s_tokenCounter);

            _safeMint(address(landERC20Instance), s_tokenCounter);

            s_tokenCounter = s_tokenCounter + 1;
            return s_tokenCounter - 1;
        }
        
    }


    // function addData(
    //     uint256 tokenId,
    //     string[] memory _ownerNames,
    //     string memory _landAddress,
    //     string memory _ownershipHistoryHash,
    //     string memory _LegalDocumentsHash
    // )
    //     // string memory _encumberances
    //     public
    // {
    //     // if (getApproved(tokenId) != msg.sender && ownerOf(tokenId) != msg.sender) {
    //     //     revert MoodNft__CantFlipMoodIfNotOwner();
    //     // }
    //     s_tokenIdToState[tokenId].ownerNames = _ownerNames;
    //     s_tokenIdToState[tokenId].landAddress = _landAddress;
    //     s_tokenIdToState[tokenId].ownershipHistoryHash = _ownershipHistoryHash;
    //     s_tokenIdToState[tokenId].legalDocumentsHash = _LegalDocumentsHash;
    //     // s_tokenIdToState[tokenId].encumberances = _encumberances;
    // }

    // PUBLIC GETTER FUNCTIONS
    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     if (ownerOf(tokenId) == address(0)) {
    //         revert NFTGeneration__TokenUriNotFound();
    //     }
    //     return s_tokenURIs[tokenId];
    // }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function getLandData(uint256 tokenId) public view returns (LandStructs.LandData memory) {
        return s_tokenIdToState[tokenId];
    }

    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //     if (ownerOf(tokenId) == address(0)) {
    //         revert ERC721Metadata__URI_QueryFor_NonExistentToken();
    //     }
    //     // string memory imageURI = s_happySvgUri;

    //     // if (s_tokenIdToState[tokenId] == NFTState.SAD) {
    //     //     imageURI = s_sadSvgUri;
    //     // }
    //     // string memory encumberances = s_tokenIdToState[tokenId].encumberances;

    //     return string(
    //         abi.encodePacked(
    //             _baseURI(),
    //             Base64.encode(
    //                 bytes( // bytes casting actually unnecessary as 'abi.encodePacked()' returns a bytes
    //                     abi.encode(
    //                         '{"ownerName":"',
    //                         s_tokenIdToState[tokenId].ownerNames, // You can add whatever name here
    //                         '", "landAddress":"',
    //                         s_tokenIdToState[tokenId].landAddress,
    //                         '", "ownershipHistory":"',
    //                         s_tokenIdToState[tokenId].ownershipHistoryHash,
    //                         '", "legalDocuments":"',
    //                         s_tokenIdToState[tokenId].legalDocumentsHash,
    //                         // '", "encumberances":"',
    //                         // encumberances,
    //                         '"}'
    //                     )
    //                 )
    //             )
    //         )
    //     );
    // }
}
