"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
// import { useEffect } from "react";
import { useAccount } from "wagmi";
import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
// import { dummyUser } from "~~/components/onchain-portfolio/test-data/dummyUser";
import { useComplexIsProfileSubscriptionActive } from "~~/hooks/onchain-portfolio/useComplexIsProfileSubscriptionActive";
import { useGetChainByValue } from "~~/hooks/onchain-portfolio/useGetChainByValue";
import { useProfileAddress } from "~~/hooks/onchain-portfolio/useProfileAddress";
import {
  useScaffoldContract,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTargetNetwork,
} from "~~/hooks/scaffold-eth";
// import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

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

  // useEffect(() => {
  //   const result = loadBurnerSK();
  //   console.log(result);
  // }, []);
  const account = useAccount();

  const { profileAddress, isLoadingProfileAddress } = useProfileAddress(params.user);

  const { data: profileData, refetch: refetchProfileData } = useScaffoldReadContract({
    contractName: "Profile",
    functionName: "getProfile",
    args: [profileAddress],
  });

  const [isLoadingEns, setIsLoadingEns] = useState(false);
  const [nickname, setNickname] = useState<string | null>();
  const [description, setDescription] = useState<string | null>();
  const [image, setImage] = useState<string | null>();
  const [isNotUsingEns, setIsNotUsingEns] = useState(false);

  // useEffect(() => {
  //   async function get() {
  //     if (!isValidEns || !profileData || profileData?.[3]) return;

  //     setIsLoadingEns(true);

  //     const publicClient = createPublicClient({
  //       chain: targetNetwork,
  //       transport: http(getAlchemyHttpUrl(targetNetwork.id)),
  //     });

  //     const nickname = await publicClient.getEnsText({ name: normalize(params.user), key: "name" });
  //     const description = await publicClient.getEnsText({ name: normalize(params.user), key: "description" });
  //     const image = await publicClient.getEnsAvatar({ name: normalize(params.user) });

  //     console.log(profileData?.[3]);
  //     setNickname(nickname);
  //     setDescription(description);
  //     setImage(image);
  //     setIsLoadingEns(false);
  //   }
  //   get();
  // }, [isValidEns, profileData, profileData?.[3]]);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    async function get() {
      if (profileData?.[3] === undefined) return;

      if (profileData?.[3]) {
        setNickname(profileData?.[0]);
        setDescription(profileData?.[1]);
        setImage(profileData?.[2]);
        setIsNotUsingEns(profileData?.[3]);
      } else {
        setIsLoadingEns(true);

        const publicClient = createPublicClient({
          chain: targetNetwork,
          transport: http(getAlchemyHttpUrl(targetNetwork.id)),
        });

        const nickname = await publicClient.getEnsText({ name: normalize(params.user), key: "name" });
        const description = await publicClient.getEnsText({ name: normalize(params.user), key: "description" });
        const image = await publicClient.getEnsAvatar({ name: normalize(params.user) });

        setNickname(nickname);
        setDescription(description);
        setImage(image);
        setIsNotUsingEns(profileData?.[3]);
        setIsLoadingEns(false);
      }
    }
    get();
  }, [
    params.user,
    profileData,
    targetNetwork,
    targetNetwork?.id,
    profileData?.[0],
    profileData?.[1],
    profileData?.[2],
    profileData?.[3],
  ]);

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { retrievedChain, isLoading: isLoadingRetrievedChain } = useGetChainByValue(params.network);

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
    chain: retrievedChain,
  });

  const { isProfileSubscriptionActive, isLoadingIsProfileSubscriptionActive, refetch } =
    useComplexIsProfileSubscriptionActive(retrievedChain, profileAddress);

  const { writeContractAsync: writeProfileAsync } = useScaffoldWriteContract("Profile");

  async function refresh() {
    await refetch();
    await refetchProfileData();
  }

  let justify: "start" | "center" = "start";
  let output;

  const isLoading =
    isLoadingPaymentVerifier ||
    isLoadingRetrievedChain ||
    isLoadingIsProfileSubscriptionActive ||
    isLoadingProfileAddress ||
    isLoadingEns;

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
            onClick={refresh}
          />
        </NoticeCard>
      );
    }

    if (output) {
      justify = "center";
    }

    if (!output) {
      async function setProfileIsNotUsingEns(value: boolean) {
        await writeProfileAsync({
          functionName: "setProfile",
          args: [profileData?.[0], profileData?.[1], profileData?.[2], value],
        });
      }

      output = (
        <Profile
          address={profileAddress}
          name={nickname}
          description={description}
          image={image}
          isNotUsingEns={isNotUsingEns}
          onCheckChange={setProfileIsNotUsingEns}
          refetch={refresh}
        />
      );
    }
  }

  console.log("render check");
  return <GrowCard justify={justify}>{output}</GrowCard>;
}
