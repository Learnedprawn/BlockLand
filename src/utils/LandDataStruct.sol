// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LandStructs {
    struct LandData {
        string[] ownerNames;
        string landAddress;
        string ownershipHistoryHash;
        string legalDocumentsHash;
        // string encumberances;
        address[] owners;
        uint256[] shares;
        uint256 price;
    }

    // struct OwnerToShare {
    //     address owner;
    //     uint256 shares;
    // }
}
