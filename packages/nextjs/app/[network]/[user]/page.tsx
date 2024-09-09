"use client";

import { useEffect, useMemo, useState } from "react";
import { createPublicClient, http, zeroAddress } from "viem";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import * as chains from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import { useGlobalState } from "~~/services/store/store";
import { enabledChains } from "~~/services/web3/wagmiConfig";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { NETWORKS_EXTRA_DATA, getAlchemyHttpUrl } from "~~/utils/scaffold-eth";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

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

  const setAdditionalChains = useGlobalState(({ setAdditionalChains }) => setAdditionalChains);

  useEffect(() => {
    async function get() {
      const value = chains as any;
      const chain2 = value[params.network];

      setPageChain(chain2);
      setAdditionalChains([chain2]);
    }
    get();
  }, [params.network, setAdditionalChains]);

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

      console.log(presentChainId);

      console.log(contract.address);

      const result = await readContract(wagmiConfig, {
        abi: contract.abi,
        address: contract.address,
        functionName: "getIsSubscriptionActive",
        chainId: presentChainId,
        args: [profileAddress],
      });

      console.log(result);
      setIsProfileSubscriptionActive(result as boolean);
    }
    get();
  }, [wagmiConfig, wagmiConfig?.chains?.length, pageChain?.id, profileAddress]);

  const [isProfileSubscriptionActive, setIsProfileSubscriptionActive] = useState<boolean>();

  // if (!isPresent) {
  //   console.log(paymentVerifier);
  // }

  // const { data: isProfileSubscriptionActive } = useScaffoldReadContract({
  //   contractName: "PaymentVerifier",
  //   functionName: "getIsSubscriptionActive",
  //   args: [profileAddress],
  //   chain: chainWithAttr,
  // });

  // console.log(isProfileSubscriptionActive);

  // console.log(isProfileSubscriptionActive);

  // console.log(pageChain);
  // console.log(paymentVerifier);

  let justify: "start" | "center" = "start";
  let output;

  if (isLoadingPaymentVerifier) {
    justify = "center";
    output = (
      <>
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
        <p className="text-center text-4xl">{"Buying more hamsters."}</p>
      </>
    );
  }
  if (pageChain === undefined) {
    output = (
      <NoticeCard>
        <UnknownNetworkCard chainName={params.network} />
      </NoticeCard>
    );
  } else if (paymentVerifier?.address === undefined) {
    output = (
      <NoticeCard>
        <NotSupportedNetworkCard chain={chainWithAttr} formattedNetwork={formattedNetwork} />
      </NoticeCard>
    );
  } else if (!isProfileSubscriptionActive) {
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

  console.log("render check");
  return <GrowCard justify={justify}>{output}</GrowCard>;
}
