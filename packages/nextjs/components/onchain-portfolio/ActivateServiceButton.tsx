"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Props = {
  profileAddress: string;
  hasBoughtBefore: boolean;
};

export const ActivateServiceButton = ({ profileAddress, hasBoughtBefore }: Props) => {
  const { data: paymentFee } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getPaymentFee",
  });

  const { writeContractAsync: writePaymentVerifierAsync } = useScaffoldWriteContract("PaymentVerifier");

  return (
    <div className="flex flex-col items-center">
      <p>{`Cost: ${formatEther(paymentFee || BigInt(0))} ether`}</p>
      <button
        onClick={async () => {
          await writePaymentVerifierAsync({
            functionName: "payFee",
            args: [profileAddress],
            value: paymentFee,
          });
        }}
        className="btn btn-primary w-[200px]"
      >
        {hasBoughtBefore ? "Renew" : "Activate"}
      </button>
    </div>
  );
};
