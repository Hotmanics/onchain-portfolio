//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/YourContract.sol";
import "../contracts/PaymentVerifier.sol";

import "./DeployHelpers.s.sol";

contract DeployPaymentVerifierScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        PaymentVerifier verifier = new PaymentVerifier(
            address(0),
            .1 ether,
            address(0),
            30 days
        );

        console.logString(
            string.concat(
                "Verifier deployed at: ",
                vm.toString(address(verifier))
            )
        );
    }

    function test() public {}
}
