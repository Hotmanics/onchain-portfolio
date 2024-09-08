//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

contract PaymentVerifier {
    error NotOwner();
    error NotEnoughPayment();

    address s_owner;
    address s_withdrawRecipient;

    uint256 s_paymentAmount;
    mapping(address => bool) s_hasPaid;
    mapping(address => uint256) s_lastPaymentDate;

    uint256 s_paymentCadence;

    event FeePaid(address indexed account, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != s_owner) revert NotOwner();
        _;
    }

    constructor(
        address owner,
        uint256 paymentAmount,
        address withdrawRecipient,
        uint256 paymentCadence
    ) {
        s_owner = owner;
        s_paymentAmount = paymentAmount;
        s_withdrawRecipient = withdrawRecipient;
        s_paymentCadence = paymentCadence;
    }

    function setPaymentAmount(uint256 amount) external onlyOwner {
        s_paymentAmount = amount;
    }

    function setPaymentCadence(uint256 cadence) external onlyOwner {
        s_paymentCadence = cadence;
    }

    function payFee(address addr) external payable {
        if (msg.value < s_paymentAmount) revert NotEnoughPayment();

        emit FeePaid(addr, msg.value);
        s_hasPaid[addr] = true;
        s_lastPaymentDate[addr] = block.timestamp;
    }

    function wtihdraw() external {
        (bool sent, ) = s_withdrawRecipient.call{value: address(this).balance}(
            ""
        );
        require(sent, "Failed to send Ether");
    }

    function getIsInGoodStanding(
        address addr
    ) external view returns (bool isInGoodStanding) {
        isInGoodStanding =
            s_lastPaymentDate[addr] + s_paymentCadence < block.timestamp;
    }
}
