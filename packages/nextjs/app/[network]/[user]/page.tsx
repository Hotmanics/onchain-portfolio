"use client";

import { useEffect, useMemo, useState } from "react";
import { zeroAddress } from "viem";
import * as chains from "viem/chains";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import deployedContracts from "~~/contracts/deployedContracts";
import { useProfileAddress } from "~~/hooks/onchain-portfolio/useProfileAddress";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import { enabledChains } from "~~/services/web3/wagmiConfig";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const dummyUser = {
  address: zeroAddress,
  name: "Jake Homanics",
  description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
  image: profilePicturePlaceholder.src,
};

export default function UserPage({ params }: { params: { network: string; user: string } }) {
  const { profileAddress, isLoadingProfileAddress } = useProfileAddress(params.user);

  const account = useAccount();

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

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

  const [pageChain, setPageChain] = useState<any>();

  // const setAdditionalChains = useGlobalState(({ setAdditionalChains }) => setAdditionalChains);

  const [isLoadingPageChain, setIsLoadingPageChain] = useState<boolean>(false);

  useEffect(() => {
    async function get() {
      setIsLoadingPageChain(true);
      const value = chains as any;
      const chain2 = value[params.network];

      setPageChain(chain2);
      // setAdditionalChains([chain2]);
      setIsLoadingPageChain(false);
    }
    get();
  }, [
    params.network,
    //setAdditionalChains
  ]);

  // const additionalChains = useGlobalState(({ additionalChains }) => additionalChains);

  const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
    contractName: "PaymentVerifier",
    chain: pageChain,
  });

  const chainWithAttr = useMemo(
    () => ({
      ...pageChain,
      ...NETWORKS_EXTRA_DATA[pageChain?.id],
    }),
    [pageChain],
  );

  const wagmiConfig = useConfig();

  const [isProfileSubscriptionActive, setIsProfileSubscriptionActive] = useState<boolean>();
  const [isLoadingIsProfileSubscriptionActive, setIsLoadingIsProfileSubscriptionActive] = useState<boolean>(false);

  useEffect(() => {
    async function get() {
      const contracts = deployedContracts as GenericContractsDeclaration | null;
      if (contracts === null) return;

      let presentChainId;

      for (let i = 0; i < enabledChains.length; i++) {
        if (enabledChains[i].id === pageChain?.id) {
          presentChainId = enabledChains[i].id;
          break;
        }
      }

      if (presentChainId === undefined) return;

      const contract = contracts[presentChainId].PaymentVerifier;

      setIsLoadingIsProfileSubscriptionActive(true);

      const result = await readContract(wagmiConfig, {
        abi: contract.abi,
        address: contract.address,
        functionName: "getIsSubscriptionActive",
        chainId: presentChainId,
        args: [profileAddress],
      });

      setIsProfileSubscriptionActive(result as boolean);
      setIsLoadingIsProfileSubscriptionActive(false);
    }
    get();
  }, [wagmiConfig, wagmiConfig?.chains?.length, pageChain?.id, profileAddress]);

  // const { data: isProfileSubscriptionActive } = useScaffoldReadContract({
  //   contractName: "PaymentVerifier",
  //   functionName: "getIsSubscriptionActive",
  //   args: [profileAddress],
  //   chain: chainWithAttr,
  // });

  let justify: "start" | "center" = "start";
  let output;

  console.log(isLoadingPaymentVerifier);
  console.log(isLoadingPageChain);
  console.log(isLoadingIsProfileSubscriptionActive);

  const isLoading =
    isLoadingPaymentVerifier || isLoadingPageChain || isLoadingIsProfileSubscriptionActive || isLoadingProfileAddress;
  console.log(isLoading);

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
    if (pageChain === undefined) {
      console.log("NOT PAGE CHAIN");
      output = (
        <NoticeCard>
          <UnknownNetworkCard chainName={params.network} />
        </NoticeCard>
      );
    } else if (paymentVerifier?.address === undefined) {
      console.log("NOT PV");

      output = (
        <NoticeCard>
          <NotSupportedNetworkCard chain={chainWithAttr} formattedNetwork={formattedNetwork} />
        </NoticeCard>
      );
    } else if (!isProfileSubscriptionActive) {
      console.log("NOT ACTIVE");

      output = (
        <NoticeCard>
          <InactiveSubscriptionCard
            connectedAddress={account?.address || ""}
            profileAddress={profileAddress}
            network={pageChain}
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
