// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

// contract TextStore is AccessControl {
contract TextStore {
    // The string of text that we will store
    // bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public owner;
    string public text;
    uint256 public storyId = 1;
    uint256 public updateCount = 0;
    

    // Constructor function that is called when the contract is deployed
    constructor(string memory initialText) {
        text = initialText;
        // _grantRole(ADMIN_ROLE, msg.sender);
        owner = msg.sender;
    }

    // Function to append more text to the original string
    function appendText(string memory additionalText) public onlyOwner {
        // require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not a minter");
        updateCount += 1;
        text = string.concat(text, additionalText);
    }

    function updateStory(string memory newStory) public onlyOwner {
        text = newStory;
        updateCount += 1;
    }

    function getStory() public view returns (string memory) {
        return text;
    }

    modifier  onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    
}

