//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {PaymentVerifier} from "../contracts/PaymentVerifier.sol";
import "../contracts/YourContract.sol";
import "../contracts/PaymentVerifier.sol";
import "./DeployHelpers.s.sol";
import {Profile} from "../contracts/Profile.sol";
import {DummyProfile} from "../contracts/DummyProfile.sol";

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
            30 days
        );

        console.logString(
            string.concat(
                "Verifier deployed at: ",
                vm.toString(address(verifier))
            )
        );

        if (getChain().chainId == 31337) {
            DummyProfile profile = new DummyProfile();

            profile.setDummyProfile(
                0x42bcD9e66817734100b86A2bab62d9eF3B63E92A,
                "Foundry Foundrson",
                "An exceptional Foundr with a knack for finding what was found.",
                "https://olive-capitalist-mule-825.mypinata.cloud/ipfs/Qmap7PvsxvwhenVtjNes3GyouYPXaguB3yVZNnKKRMjXHV"
            );
        } else {
            new Profile();
        }

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
