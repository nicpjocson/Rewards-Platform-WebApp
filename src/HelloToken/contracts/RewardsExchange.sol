// SPDX-License-Identifier: MIT
/*

    Notes
    - this contract has its own inventory of Hello Tokens
    - if owner wants to exchange tokens to points they have to approve() this address with the amount they want to exchange

*/
pragma solidity ^0.8.0;

import "./HelloToken.sol";

contract RewardsExchange {
    address public owner;
    HelloToken public customToken;
    uint256 public tokens;

    event TokensExchanged(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _customToken) {
        owner = msg.sender;
        customToken = HelloToken(_customToken);
    }

    function exchangeTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        // Transfer ERC-20 tokens from the user to this contract
        require(
            customToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        emit TokensExchanged(msg.sender, amount);
        tokens += amount;
    }

    //transfers the tokens stored in the contract to owner wallet
    function withdrawTokens() external onlyOwner {
        require(customToken.transfer(owner, tokens), "Token withdrawal failed");
        tokens = 0;
    }

    //transfers ownership of contract to another address
    function setOwner(address _newOwnerAddress) external onlyOwner {
        owner = _newOwnerAddress;
    }
}
