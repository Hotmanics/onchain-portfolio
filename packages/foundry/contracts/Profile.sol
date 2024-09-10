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
    mapping(address => bool) s_isNotUsingEns;

    // PaymentVerifier s_paymentVerifier;

    // constructor(address paymentVerifier) {
    //     s_paymentVerifier = PaymentVerifier(paymentVerifier);
    // }

    constructor(
        address initWho,
        string memory initName,
        string memory initDescription,
        string memory initImageUrl,
        bool initIsNotUsingEns
    ) {
        _setProfile(
            initWho,
            initName,
            initDescription,
            initImageUrl,
            initIsNotUsingEns
        );
    }

    function setProfile(
        string memory name,
        string memory description,
        string memory imageUrl,
        bool isUsingEns
    ) external {
        // if (!s_paymentVerifier.getIsSubscriptionActive(msg.sender)) {
        //     revert InactiveAccount();
        // }
        _setProfile(msg.sender, name, description, imageUrl, isUsingEns);
    }

    function _setProfile(
        address who,
        string memory name,
        string memory description,
        string memory imageUrl,
        bool isNotUsingEns
    ) internal {
        s_name[who] = name;
        s_description[who] = description;
        s_imageUrl[who] = imageUrl;
        s_isNotUsingEns[who] = isNotUsingEns;
    }

    function getProfile(
        address who
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory imageUrl,
            bool isNotUsingEns
        )
    {
        return (
            s_name[who],
            s_description[who],
            s_imageUrl[who],
            s_isNotUsingEns[who]
        );
    }
}
