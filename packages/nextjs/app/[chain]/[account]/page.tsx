"use client";

import "react";
import { useState } from "react";
import { isAddress, zeroAddress } from "viem";
import { foundry, sepolia } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount, useEnsAddress, useEnsAvatar, useEnsName, useEnsText } from "wagmi";
import { DebuggingSection } from "~~/components/onchain-portfolio/DebuggingSection";
import { EditProfile } from "~~/components/onchain-portfolio/EditProfile";
import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import "~~/hooks/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { getChainWithAttributes } from "~~/utils/onchain-portfolio/scaffoldEth";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { getChainByName } from "~~/utils/onchain-portfolio/viemHelpers";

const isDebugging = false;
const ensSpoofChain = getChainWithAttributes(sepolia);

export default function UserPage({ params }: { params: { chain: string; account: string } }) {
  const paramsChain = getChainByName(params.chain);

  const isFoundry = paramsChain?.id === foundry.id;

  const selectedEnsChain = isFoundry && !isAddress(params.account) ? ensSpoofChain : paramsChain;
  const { data: resolvedEnsAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: normalize(params.account),
    chainId: selectedEnsChain?.id,
  });

  const { data: resolvedEnsName, isLoading: isLoadingEnsName } = useEnsName({
    address: params.account,
    chainId: selectedEnsChain?.id,
  });

  let usableEnsName = resolvedEnsName;
  let authenticAddress = "";
  const account = useAccount();

  if (resolvedEnsAddress && resolvedEnsName === null) {
    // Valid network with params.account == ens name.
    //address: resolvedEnsAddress
    //ensName: params.account

    authenticAddress = isFoundry ? account?.address ?? zeroAddress : resolvedEnsAddress;
    usableEnsName = params.account;

    console.log(1);
  }

  if (resolvedEnsName && resolvedEnsAddress === null) {
    // Valid network with params.account == address that DOES have a registered ENS name.
    //address: params.account
    //ensName: resolvedEnsName

    authenticAddress = params.account;
    console.log(2);
  }

  if (resolvedEnsAddress === null && resolvedEnsName === null) {
    // Valid Network with params.account == address that DOES NOT have a registered ENS name.
    //address: params.account
    //ensName: undefined

    authenticAddress = params.account as `0x${string}`;

    console.log(3);
  }

  if (resolvedEnsAddress === undefined && resolvedEnsName === undefined) {
    console.log(4);

    if (paramsChain === undefined) {
      //Invalid Network
      console.log(5);
    } else {
      //Unsupported Network
      console.log(6);
    }
  }

  const { data: ensNickname, isLoading: isLoadingEnsNickname } = useEnsText({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
    key: "name",
  });

  const { data: ensDescription, isLoading: isLoadingEnsDescription } = useEnsText({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
    key: "description",
  });

  const { data: ensAvatar, isLoading: isLoadingEnsAvatar } = useEnsAvatar({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
  });

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: getProfileData,
  } = useScaffoldReadContract({
    contractName: "Profile",
    functionName: "getProfile",
    args: [authenticAddress],
    chain: paramsChain,
  });

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
    chain: paramsChain,
  });

  const {
    data: isSubscriptionActive,
    isLoading: isLoadingIsSubscriptionActive,
    refetch: refetchIsSubscriptionActive,
  } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsSubscriptionActive",
    args: [authenticAddress],
    chain: paramsChain,
  });

  const formattedNetwork = insertSpaces(params.chain).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  async function refresh() {
    await refetchIsSubscriptionActive();
    await getProfileData();
  }

  let justify: "start" | "center" = "start";
  let output;

  const isLoading =
    isLoadingEnsAddress ||
    isLoadingEnsName ||
    isLoadingEnsDescription ||
    isLoadingEnsAvatar ||
    isLoadingEnsNickname ||
    isLoadingIsSubscriptionActive ||
    isLoadingPaymentVerifier ||
    isLoadingProfile;

  const [isEditingPage, setIsEditingPage] = useState(false);

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
    if (paramsChain === undefined) {
      output = (
        <NoticeCard>
          <UnknownNetworkCard chainName={params.chain} />
        </NoticeCard>
      );
    } else if (paymentVerifier?.address === undefined) {
      output = (
        <NoticeCard>
          <NotSupportedNetworkCard chain={paramsChain} formattedNetwork={formattedNetwork} />
        </NoticeCard>
      );
    } else if (!isSubscriptionActive) {
      output = (
        <NoticeCard>
          <InactiveSubscriptionCard
            connectedAddress={account?.address || ""}
            profileAddress={authenticAddress}
            network={paramsChain}
            onClick={refresh}
          />
        </NoticeCard>
      );
    }

    if (output) {
      justify = "center";
    }

    const nickname = profileData?.[3] ? profileData?.[0] : ensNickname;
    const description = profileData?.[3] ? profileData?.[1] : ensDescription;
    const image = profileData?.[3] ? profileData?.[2] : ensAvatar;

    if (!output) {
      output = !isEditingPage ? (
        <>
          <Profile address={authenticAddress} name={nickname} description={description} image={image} />
          {account?.address === authenticAddress ? (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditingPage(true);
              }}
            >
              Edit Page
            </button>
          ) : (
            <></>
          )}
        </>
      ) : (
        <EditProfile
          name={profileData?.[0]}
          description={profileData?.[1]}
          image={profileData?.[2]}
          isUsingProfile={profileData?.[3]}
          isUsingEns={profileData?.[4]}
          onExitEditMode={() => {
            setIsEditingPage(false);
          }}
        />
      );
    }
  }

  console.log("render check");

  return (
    <GrowCard justify={justify}>
      <DebuggingSection
        isDebugging={isDebugging}
        paramsChain={paramsChain}
        selectedEnsChain={selectedEnsChain}
        authenticAddress={authenticAddress}
      />
      {output}
    </GrowCard>
  );
}
