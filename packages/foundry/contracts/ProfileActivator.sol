//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

import "./PaymentVerifier.sol";
import "./Profile.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProfileActivator is AccessControl {
    // error InactiveAccount();

    PaymentVerifier s_paymentVerifier;
    Profile s_profile;

    constructor(address[] memory admins) {
        for (uint256 i = 0; i < admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
        }
    }

    function setPaymentVerifier(
        address paymentVerifier
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        s_paymentVerifier = PaymentVerifier(paymentVerifier);
    }

    function setProfile(address profile) external onlyRole(DEFAULT_ADMIN_ROLE) {
        s_profile = Profile(profile);
    }

    function activateAndSetProfile(address who) external payable {
        if (s_paymentVerifier.getLastPaymentDate(who) == 0) {
            s_profile.setProfile(
                who,
                "Foundry Foundrson2",
                "An exceptional Foundr with a knack for finding what was found.",
                "https://olive-capitalist-mule-825.mypinata.cloud/ipfs/Qmap7PvsxvwhenVtjNes3GyouYPXaguB3yVZNnKKRMjXHV",
                true,
                false
            );
        }

        s_paymentVerifier.payFee{value: msg.value}(who);
    }
}
