"use client";

import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http, parseEther } from "viem";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { Profile } from "~~/components/onchain-portfolio/Profile";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export default function CollectionPage({ params }: { params: { network: string; user: string } }) {
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const [isValidEns, setIsValidEns] = useState<boolean>();

  useEffect(() => {
    async function get() {
      let selectedAddress;

      if (isAddress(params.user)) {
        selectedAddress = params.user;
      } else {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(getAlchemyHttpUrl(mainnet.id)),
        });

        const addr = await publicClient.getEnsAddress({
          name: normalize(params.user),
        });

        selectedAddress = addr as string;
        setIsValidEns(true);
      }

      setSelectedAddress(selectedAddress);
    }
    get();
  }, []);

  const account = useAccount();

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
  });

  const { data: isInGoodStanding } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsInGoodStanding",
    args: [selectedAddress],
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
    args: [selectedAddress],
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
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
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

  const displayAddress = selectedAddress?.slice(0, 6) + "..." + selectedAddress?.slice(-4);

  const displayName = isValidEns ? params.user : displayAddress;

  return (
    <div className="flex flex-col items-center space-y-40 md:space-y-10">
      <div className="bg-secondary w-full p-10">
        {isInGoodStanding ? (
          <Profile
            address={selectedAddress || ""}
            name="Jacob Homanics"
            description="Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech."
            image={profilePicturePlaceholder.src}
          />
        ) : (
          <div className="flex flex-wrap space-x-1 text-center items-center justify-center">
            {/* <Address address={params.address} showIcon={false} showCopy={false} /> */}
            {hasBoughtBefore ? (
              <p>{`${displayName}'s Onchain Portfolio Subscription is no longer active on the ${formattedNetwork} blockchain!`}</p>
            ) : (
              <p>{`${displayName} does not have an active Onchain Portfolio Subscription on the ${formattedNetwork} blockchain!`}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        {!isInGoodStanding && account?.address ? (
          <>
            {account.address !== selectedAddress ? <p>{"Feeling generous? Pay for their service fee."}</p> : <></>}
            <p>{`Cost: ${formatEther(paymentFee || BigInt(0))} ether`}</p>
            <button
              onClick={async () => {
                await writePaymentVerifierAsync({
                  functionName: "payFee",
                  args: [selectedAddress],
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
