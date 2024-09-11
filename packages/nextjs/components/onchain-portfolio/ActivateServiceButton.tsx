"use client";

import { Chain, formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Props = {
  profileAddress: string;
  network?: Chain;
  onClick?: any;
};

export const ActivateServiceButton = ({ profileAddress, network, onClick }: Props) => {
  const { data: paymentFee } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getPaymentFee",
  });

  // const { writeContractAsync: writePaymentVerifierAsync } = useScaffoldWriteContract("PaymentVerifier", network);
  const { writeContractAsync: writeProfileActivatorAsync } = useScaffoldWriteContract("ProfileActivator", network);

  return (
    <div className="flex flex-col items-center m-4">
      <p className="m-0">{`Cost: ${formatEther(paymentFee || BigInt(0))} ether`}</p>
      <button
        onClick={async () => {
          console.log(profileAddress);
          await writeProfileActivatorAsync({
            functionName: "activateAndSetProfile",
            value: paymentFee,
            args: [profileAddress],
          });

          // await writePaymentVerifierAsync({
          //   functionName: "payFee",
          //   args: [profileAddress],
          //   value: paymentFee,
          // });

          if (onClick) await onClick();
        }}
        className="btn btn-base-300 btn-lg"
      >
        Activate
      </button>
    </div>
  );
};
