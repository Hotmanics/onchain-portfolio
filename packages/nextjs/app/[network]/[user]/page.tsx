"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { ActivateServiceSection } from "~~/components/onchain-portfolio/ActivateServiceSection";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { AddressRaw } from "~~/components/scaffold-eth/AddressRaw";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export default function UserPage({ params }: { params: { network: string; user: string } }) {
  const [profileAddress, setProfileAddress] = useState<string>();

  // const [isValidEns, setIsValidEns] = useState<boolean>();

  useEffect(() => {
    async function get() {
      let userAddress;

      if (isAddress(params.user)) {
        userAddress = params.user;
      } else {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(getAlchemyHttpUrl(mainnet.id)),
        });

        const addr = await publicClient.getEnsAddress({
          name: normalize(params.user),
        });

        userAddress = addr as string;
        // setIsValidEns(true);
      }

      setProfileAddress(userAddress);
    }
    get();
  }, [params.user]);

  const account = useAccount();

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
  });

  const { data: isInGoodStanding } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsInGoodStanding",
    args: [profileAddress],
  });

  //   const { data: paymentCadence } = useScaffoldReadContract({
  //     contractName: "PaymentVerifier",
  //     functionName: "getPaymentCadence",
  //   });

  const { data: lastPaymentDate } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getLastPaymentDate",
    args: [profileAddress],
  });

  const hasBoughtBefore = lastPaymentDate === BigInt(0) ? false : true;

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

  console.log("render check");
  return (
    <div className="flex flex-col items-center space-y-40 md:space-y-10">
      <div className="bg-secondary w-full p-10">
        {isInGoodStanding ? (
          <Profile
            address={profileAddress || ""}
            name="Jacob Homanics"
            description="Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech."
            image={profilePicturePlaceholder.src}
          />
        ) : (
          <div className="flex w-full items-center justify-center text-center">
            <span className="mx-10 md:mx-[550px]">
              <AddressRaw address={profileAddress} />
              {hasBoughtBefore ? (
                <span>{`'s Onchain Portfolio Subscription is no longer active on the ${formattedNetwork} blockchain!`}</span>
              ) : (
                <span className="ml-1">{`does not have an active Onchain Portfolio Subscription on the ${formattedNetwork} blockchain!`}</span>
              )}
            </span>
          </div>
        )}
      </div>

      <ActivateServiceSection
        connectedAddress={account?.address || ""}
        userAddress={profileAddress || ""}
        hasBoughtBefore={hasBoughtBefore}
        isInGoodStanding={isInGoodStanding || false}
      />
    </div>
  );
}
