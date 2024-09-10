"use client";

import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import { useComplexIsProfileSubscriptionActive } from "~~/hooks/onchain-portfolio/useComplexIsProfileSubscriptionActive";
import { useGetChainByValue } from "~~/hooks/onchain-portfolio/useGetChainByValue";
import { useProfileAddress } from "~~/hooks/onchain-portfolio/useProfileAddress";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";

const dummyUser = {
  address: zeroAddress,
  name: "Jake Homanics",
  description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
  image: profilePicturePlaceholder.src,
};

export default function UserPage({ params }: { params: { network: string; user: string } }) {
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

  const account = useAccount();

  const { profileAddress, isLoadingProfileAddress } = useProfileAddress(params.user);

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { retrievedChain, isLoading: isLoadingRetrievedChain } = useGetChainByValue(params.network);

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
    chain: retrievedChain,
  });

  const { isProfileSubscriptionActive, isLoadingIsProfileSubscriptionActive } = useComplexIsProfileSubscriptionActive(
    retrievedChain,
    profileAddress,
  );

  let justify: "start" | "center" = "start";
  let output;

  const isLoading =
    isLoadingPaymentVerifier ||
    isLoadingRetrievedChain ||
    isLoadingIsProfileSubscriptionActive ||
    isLoadingProfileAddress;

  if (isLoading) {
    justify = "center";
    output = (
      <>
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
        <p className="text-center text-4xl">{"Buying more hamsters."}</p>
      </>
    );
  } else {
    if (retrievedChain === undefined) {
      output = (
        <NoticeCard>
          <UnknownNetworkCard chainName={params.network} />
        </NoticeCard>
      );
    } else if (paymentVerifier?.address === undefined) {
      output = (
        <NoticeCard>
          <NotSupportedNetworkCard chain={retrievedChain} formattedNetwork={formattedNetwork} />
        </NoticeCard>
      );
    } else if (!isProfileSubscriptionActive) {
      output = (
        <NoticeCard>
          <InactiveSubscriptionCard
            connectedAddress={account?.address || ""}
            profileAddress={profileAddress}
            network={retrievedChain}
          />
        </NoticeCard>
      );
    }

    if (output) {
      justify = "center";
    }

    if (!output) {
      output = (
        <Profile
          address={profileAddress}
          name={dummyUser.name}
          description={dummyUser.description}
          image={dummyUser.image}
        />
      );
    }
  }

  console.log("render check");
  return <GrowCard justify={justify}>{output}</GrowCard>;
}
