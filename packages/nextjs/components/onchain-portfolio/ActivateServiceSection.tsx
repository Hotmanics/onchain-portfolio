"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  hasBoughtBefore: boolean;
};

export const ActivateServiceSection = ({ connectedAddress, profileAddress, hasBoughtBefore }: Props) => {
  const { data: paymentFee } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getPaymentFee",
  });

  const { writeContractAsync: writePaymentVerifierAsync } = useScaffoldWriteContract("PaymentVerifier");

  return (
    <div className="flex flex-col items-center">
      {connectedAddress !== profileAddress ? <p>{"Feeling generous? Pay for their service fee."}</p> : <></>}
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
