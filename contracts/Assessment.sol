// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    uint256 public age = 8;
    string public name = "Anonymous";

    event NewAge(uint256 age);
    event NewName(string name);

    error InvalidAge(uint256 ageInput, uint256 minimumAge);

    function getAge() public view returns (uint256) {
        return age;
    }

    function setAge(uint256 newAge) public {
        age = newAge;
        if (age < 4) {
            revert InvalidAge({ageInput: age, minimumAge: 4});
        }

        emit NewAge(age);
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory newName) public {
        name = newName;

        emit NewName(name);
    }
}
