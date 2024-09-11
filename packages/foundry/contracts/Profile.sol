//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Profile is AccessControl {
    error NotAuthorizedEntity();

    mapping(address => string) s_name;
    mapping(address => string) s_description;
    mapping(address => string) s_imageUrl;

    mapping(address => bool) s_isShowingOnchain;
    mapping(address => bool) s_isShowingEns;

    constructor(
        address[] memory authorizedEntities // address initWho, // string memory initName, // string memory initDescription,
    ) // string memory initImageUrl,
    // bool isShowingOnchain,
    // bool isShowingEns
    {
        for (uint256 i = 0; i < authorizedEntities.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, authorizedEntities[i]);
        }

        // _setProfile(
        //     initWho,
        //     initName,
        //     initDescription,
        //     initImageUrl,
        //     isShowingOnchain,
        //     isShowingEns
        // );
    }

    function setProfile(
        address who,
        string memory name,
        string memory description,
        string memory imageUrl,
        bool isShowingOnchain,
        bool isShowingEns
    ) external {
        if (msg.sender != who) {
            if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
                revert NotAuthorizedEntity();
            }
        }

        _setProfile(
            who,
            name,
            description,
            imageUrl,
            isShowingOnchain,
            isShowingEns
        );
    }

    function setProfile2(
        string memory name,
        string memory description,
        string memory imageUrl,
        bool isShowingOnchain,
        bool isShowingEns
    ) external {
        _setProfile(
            msg.sender,
            name,
            description,
            imageUrl,
            isShowingOnchain,
            isShowingEns
        );
    }

    function _setProfile(
        address who,
        string memory name,
        string memory description,
        string memory imageUrl,
        bool isShowingOnchain,
        bool isShowingEns
    ) internal {
        s_name[who] = name;
        s_description[who] = description;
        s_imageUrl[who] = imageUrl;
        s_isShowingOnchain[who] = isShowingOnchain;
        s_isShowingEns[who] = isShowingEns;
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
            bool isShowingOnchain,
            bool isShowingEns
        )
    {
        return (
            s_name[who],
            s_description[who],
            s_imageUrl[who],
            s_isShowingOnchain[who],
            s_isShowingEns[who]
        );
    }
}
