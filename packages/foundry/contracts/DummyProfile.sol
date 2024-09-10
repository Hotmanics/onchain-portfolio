//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";
import {Profile} from "./Profile.sol";

contract DummyProfile is Profile {
    function setDummyProfile(
        address who,
        string memory name,
        string memory description,
        string memory imageUrl
    ) external {
        s_name[who] = name;
        s_description[who] = description;
        s_imageUrl[who] = imageUrl;
    }
}
