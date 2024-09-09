"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, zeroAddress } from "viem";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import * as chains from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const dummyUser = {
  address: zeroAddress,
  name: "Jake Homanics",
  description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
  image: profilePicturePlaceholder.src,
};

export default function UserPage({ params }: { params: { network: string; user: string } }) {
  const [profileAddress, setProfileAddress] = useState<string>(dummyUser.address);

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

  const { data: isProfileSubscriptionActive } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsSubscriptionActive",
    args: [profileAddress],
  });

  //   const { data: paymentCadence } = useScaffoldReadContract({
  //     contractName: "PaymentVerifier",
  //     functionName: "getPaymentCadence",
  //   });

  // const { data: lastPaymentDate } = useScaffoldReadContract({
  //   contractName: "PaymentVerifier",
  //   functionName: "getLastPaymentDate",
  //   args: [profileAddress],
  // });

  // const hasBoughtBefore = lastPaymentDate === BigInt(0) ? false : true;

  const [pageChain, setPageChain] = useState<number>();

  useEffect(() => {
    async function get() {
      const value = chains as any;
      const chain2 = value[params.network];

      setPageChain(chain2.id);
    }
    get();
  }, [params.network]);

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
    chainId: pageChain,
  });

  console.log(paymentVerifier);

  if (isLoadingPaymentVerifier) {
    return (
      <div className="bg-secondary w-full flex flex-col flex-grow p-10 justify-center items-center">
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
        <p className="text-center text-4xl">{"Buying more hamsters."}</p>
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
    <div
      className={`bg-secondary w-full flex flex-col flex-grow items-center ${
        isProfileSubscriptionActive ? "justify-start" : "justify-center"
      }`}
    >
      {isProfileSubscriptionActive ? (
        <Profile
          address={profileAddress}
          name={dummyUser.name}
          description={dummyUser.description}
          image={dummyUser.image}
        />
      ) : (
        <div className="shadow-2xl rounded-xl">
          <InactiveSubscriptionCard
            connectedAddress={account?.address || ""}
            profileAddress={profileAddress}
            network={formattedNetwork}
          />
        </div>
      )}
    </div>
  );
}
