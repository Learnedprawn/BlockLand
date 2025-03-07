// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {LandStructs} from "./utils/LandDataStruct.sol";

contract SingleOwnerNFT is ERC721 {
    error NFTGeneration__TokenUriNotFound();
    error ERC721Metadata__URI_QueryFor_NonExistentToken();

    event NFTMinted(address indexed nftOwner, uint256 indexed tokenId);

    mapping(uint256 tokenId => string tokenURI) public s_tokenURIs;
    mapping(uint256 tokenId => LandStructs.LandData landData) public s_tokenIdToState;
    uint256 public s_tokenCounter;

    constructor() ERC721("LandNFT", "LNFT") {
        s_tokenCounter = 0;
    }

    function mintNft(LandStructs.LandData memory landData) public returns (uint256) {
        address nftOwner = landData.owner;
        _safeMint(nftOwner, s_tokenCounter);
        s_tokenIdToState[s_tokenCounter] = landData;
        s_tokenCounter = s_tokenCounter + 1;

        emit NFTMinted(nftOwner, s_tokenCounter - 1);

        return s_tokenCounter - 1;
    }

    // PUBLIC GETTER FUNCTIONS

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function getLandData(uint256 tokenId) public view returns (LandStructs.LandData memory) {
        return s_tokenIdToState[tokenId];
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        }
        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes( // bytes casting actually unnecessary as 'abi.encodePacked()' returns a bytes
                        abi.encodePacked(
                            '{"ownerName":"',
                            s_tokenIdToState[tokenId].ownerName, // You can add whatever name here
                            '", "landAddress":"',
                            s_tokenIdToState[tokenId].landAddress,
                            '", "ownershipHistory":"',
                            s_tokenIdToState[tokenId].ownershipHistoryHash,
                            '", "legalDocuments":"',
                            s_tokenIdToState[tokenId].legalDocumentsHash,
                            '"}'
                        )
                    )
                )
            )
        );
    }
}
