//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {PaymentVerifier} from "../contracts/PaymentVerifier.sol";
import "../contracts/YourContract.sol";
import "../contracts/PaymentVerifier.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);

        PaymentVerifier verifier = new PaymentVerifier(
            address(0),
            .1 ether,
            address(0),
            10 seconds
        );

        console.logString(
            string.concat(
                "Verifier deployed at: ",
                vm.toString(address(verifier))
            )
        );
        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
