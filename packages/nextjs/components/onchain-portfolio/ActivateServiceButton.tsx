"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Props = {
  profileAddress: string;
};

export const ActivateServiceButton = ({ profileAddress }: Props) => {
  const { data: paymentFee } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getPaymentFee",
  });

  const { writeContractAsync: writePaymentVerifierAsync } = useScaffoldWriteContract("PaymentVerifier");

  return (
    <div className="flex flex-col items-center m-4">
      <p className="m-0">{`Cost: ${formatEther(paymentFee || BigInt(0))} ether`}</p>
      <button
        onClick={async () => {
          await writePaymentVerifierAsync({
            functionName: "payFee",
            args: [profileAddress],
            value: paymentFee,
          });
        }}
        className="btn btn-base-300 btn-lg"
      >
        Activate
      </button>
    </div>
  );
};
