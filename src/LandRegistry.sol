// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LandRegistry is Ownable {
    struct LandData {
        uint256 id;
        string[] ownerNames;
        uint256 price;
        string landAddress;
        string ownershipHistoryHash;
        string legalDocumentsHash;
        address[] owners;
        uint256[] shares;
        bool isVerified;
    }

    mapping(uint256 => LandData) public lands;
    uint256 public landCounter = 0;

    address public governmentOfficial;

    modifier onlyGovernmentOfficial() {
        require(msg.sender == governmentOfficial, "Not the government official");
        _;
    }

    event LandRegistered(uint256 indexed landId, address indexed registeredBy);
    event LandVerified(uint256 indexed landId, address indexed verifiedBy);

    constructor(address _govtOfficial) Ownable(msg.sender) {
        require(_govtOfficial != address(0), "Invalid government official address");
        governmentOfficial = _govtOfficial;
    }

    function registerLand(
        string[] memory _names,
        uint256 _price,
        string memory _landAddress,
        string memory _ownershipHistoryHash,
        string memory _legalDocumentsHash,
        address[] memory _owners,
        uint256[] memory _shares
    ) external {
        require(_owners.length > 0, "At least one owner required");
        require(_owners.length == _shares.length, "Owners and shares length mismatch");

        landCounter++;

        lands[landCounter] = LandData({
            id: landCounter,
            ownerNames: _names,
            price: _price,
            landAddress: _landAddress,
            ownershipHistoryHash: _ownershipHistoryHash,
            legalDocumentsHash: _legalDocumentsHash,
            owners: _owners,
            shares: _shares,
            isVerified: false
        });

        emit LandRegistered(landCounter, msg.sender);
    }

    function verifyLand(uint256 landId) public onlyGovernmentOfficial {
        require(landId > 0 && landId <= landCounter, "Invalid land ID");
        require(!lands[landId].isVerified, "Land already verified");

        lands[landId].isVerified = true;
        emit LandVerified(landId, msg.sender);
    }

    function getLandDetails(uint256 landId)
        public
        view
        returns (
            uint256 id,
            string[] memory ownerNames,
            uint256 price,
            string memory landAddress,
            string memory ownershipHistoryHash,
            string memory legalDocumentsHash,
            address[] memory owners,
            uint256[] memory shares,
            bool isVerified
        )
    {
        require(landId > 0 && landId <= landCounter, "Invalid land ID");

        LandData storage land = lands[landId];
        return (
            land.id,
            land.ownerNames,
            land.price,
            land.landAddress,
            land.ownershipHistoryHash,
            land.legalDocumentsHash,
            land.owners,
            land.shares,
            land.isVerified
        );
    }

    function getAllLands() public view returns (LandData[] memory) {
        LandData[] memory allLands = new LandData[](landCounter);
        for (uint256 i = 1; i <= landCounter; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }
}
