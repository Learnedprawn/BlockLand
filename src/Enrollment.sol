// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Enrollment {
    struct user {
        string name;
        string nullifier;
        string age;
        string gender;
        string pincode;
        string state;
    }

    struct governmentOfficial {
        string name;
        string nullifier;
        string age;
        string gender;
        string pincode;
        string state;
    }

    mapping(address => user) public users;
    mapping(address => governmentOfficial) public governmentOfficials;

    function enrollUser(
        string memory _name,
        string memory nullifier,
        string memory age,
        string memory gender,
        string memory pincode,
        string memory state
    ) public {
        users[msg.sender] = user(_name, nullifier, age, gender, pincode, state);
    }

    function enrollGovernmentOfficial(
        string memory _name,
        string memory nullifier,
        string memory age,
        string memory gender,
        string memory pincode,
        string memory state
    ) public {
        governmentOfficials[msg.sender] = governmentOfficial(_name, nullifier, age, gender, pincode, state);
    }

    function getUser(address _user) public view returns (user memory) {
        return users[_user];
    }

    function getGovernmentOfficial(address _governmentOfficial) public view returns (governmentOfficial memory) {
        return governmentOfficials[_governmentOfficial];
    }
}
