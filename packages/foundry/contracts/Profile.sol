//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// import "./PaymentVerifier.sol";

contract Profile {
    // error InactiveAccount();

    mapping(address => string) s_name;
    mapping(address => string) s_description;
    mapping(address => string) s_imageUrl;

    // PaymentVerifier s_paymentVerifier;

    // constructor(address paymentVerifier) {
    //     s_paymentVerifier = PaymentVerifier(paymentVerifier);
    // }

    function setProfile(
        string memory name,
        string memory description,
        string memory imageUrl
    ) external {
        // if (!s_paymentVerifier.getIsSubscriptionActive(msg.sender)) {
        //     revert InactiveAccount();
        // }

        s_name[msg.sender] = name;
        s_description[msg.sender] = description;
        s_imageUrl[msg.sender] = imageUrl;
    }

    function getProfile(
        address who
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory imageUrl
        )
    {
        return (s_name[who], s_description[who], s_imageUrl[who]);
    }
}
