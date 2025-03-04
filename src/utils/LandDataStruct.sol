// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LandStructs {
    struct LandData {
        string ownerName;
        string landAddress;
        string ownershipHistoryHash;
        string legalDocumentsHash;
        // string encumberances;
        address owner;
        uint256 share;
        uint256 price;
    }

    // struct OwnerToShare {
    //     address owner;
    //     uint256 shares;
    // }
}
