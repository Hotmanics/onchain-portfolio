"use client";

import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CollectionPage({ params }: { params: { network: string; address: string } }) {
  const account = useAccount();

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
  });
  console.log(paymentVerifier?.address);

  const { data: isInGoodStanding } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsInGoodStanding",
    args: [params.address],
  });

  const { data: paymentFee } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getPaymentFee",
  });

  //   const { data: paymentCadence } = useScaffoldReadContract({
  //     contractName: "PaymentVerifier",
  //     functionName: "getPaymentCadence",
  //   });

  const { data: lastPaymentDate } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getLastPaymentDate",
    args: [params.address],
  });

  const { writeContractAsync: writePaymentVerifierAsync } = useScaffoldWriteContract("PaymentVerifier");

  const hasBoughtBefore = lastPaymentDate === BigInt(0) ? false : true;

  function insertSpaces(string: string) {
    string = string.replace(/([a-z])([A-Z])/g, "$1 $2");
    string = string.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
    return string;
  }

  if (isLoadingPaymentVerifier) {
    return (
      <div className="bg-secondary w-full p-10">
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
      </div>
    );
  }

  if (paymentVerifier?.address === undefined) {
    return (
      <div className="bg-secondary w-full p-10">
        <p className="text-center text-4xl">{formattedNetwork + " is not a supported network!"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-40 md:space-y-10">
      <div className="bg-secondary w-full p-10">
        {isInGoodStanding ? (
          <p className="text-center break-words">{`Welcome to ${params.address}'s page!`}</p>
        ) : (
          <div className="flex flex-wrap space-x-1 text-center items-center justify-center">
            <Address address={params.address} showIcon={false} showCopy={false} />
            <p>{` does not have an active onchain portfolio on the ${formattedNetwork} blockchain!`}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        {!isInGoodStanding && account?.address ? (
          <>
            {account.address !== params.address ? <p>{"Feeling generous? Pay for their service fee."}</p> : <></>}
            <p>{`Cost: ${formatEther(paymentFee || BigInt(0))} ether`}</p>
            <button
              onClick={async () => {
                await writePaymentVerifierAsync({
                  functionName: "payFee",
                  args: [params.address],
                  value: parseEther("0.1"),
                });
              }}
              className="btn btn-primary w-[200px]"
            >
              {hasBoughtBefore ? "Renew" : "Activate"}
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
