// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplaceEscrow {
    address public governmentOfficial;

    struct Escrow {
        address seller;
        address buyer;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool approved;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCounter;

    event EscrowCreated(uint256 escrowId, address indexed seller, address indexed buyer, uint256 tokenId);
    event EscrowApproved(uint256 escrowId);
    event TransactionExecuted(uint256 escrowId);
    event EscrowCancelled(uint256 escrowId);

    modifier onlyGovernmentOfficial() {
        require(msg.sender == governmentOfficial, "Not authorized");
        _;
    }

    constructor(address _govOfficial) {
        governmentOfficial = _govOfficial;
    }

    function _createEscrow(address _buyer, address _nftContract, uint256 _tokenId, uint256 _price) internal returns(uint256) {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "You don't own this NFT");
        require(nft.getApproved(_tokenId) == address(this), "Contract not approved to transfer NFT");

        escrowCounter++;
        escrows[escrowCounter] = Escrow({
            seller: msg.sender,
            buyer: _buyer,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            approved: false
        });

        emit EscrowCreated(escrowCounter, msg.sender, _buyer, _tokenId);
        return escrowCounter-1;
    }

    function approveEscrow(uint256 _escrowId) external onlyGovernmentOfficial {
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.approved, "Already approved");

        escrow.approved = true;
        emit EscrowApproved(_escrowId);
    }

    // function executeTransaction(uint256 _escrowId) external payable {
    //     Escrow storage escrow = escrows[_escrowId];
    //     // require(escrow.approved, "Escrow not approved by government official");
    //     require(msg.value >= escrow.price, "Insufficient funds sent");
    //     require(msg.sender == escrow.buyer, "Only the buyer can execute");

    //     // Transfer NFT to buyer
    //     IERC721(escrow.nftContract).transferFrom(escrow.seller, escrow.buyer, escrow.tokenId);

    //     // Transfer funds to seller
    //     payable(escrow.seller).transfer(escrow.price);

    //     emit TransactionExecuted(_escrowId);
    // }

    function _cancelEscrow(uint256 _escrowId) internal {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.seller || msg.sender == governmentOfficial, "Not authorized");

        delete escrows[_escrowId];
        emit EscrowCancelled(_escrowId);
    }
}
