"use client";

import { useEffect, useMemo, useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  //Chain, createClient,
  createPublicClient,
  http,
  zeroAddress,
} from "viem";
import { isAddress } from "viem";
import {
  //hardhat,
  mainnet,
} from "viem/chains";
import * as chains from "viem/chains";
import { normalize } from "viem/ens";
import {
  //WagmiProvider, createConfig,
  useAccount,
} from "wagmi";
import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
// import scaffoldConfig from "~~/scaffold.config";
// import { wagmiConnectors } from "~~/services/web3/wagmiConnectors";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { NETWORKS_EXTRA_DATA, getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const dummyUser = {
  address: zeroAddress,
  name: "Jake Homanics",
  description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
  image: profilePicturePlaceholder.src,
};

export default function NetworkUser({ params }: { params: { network: string; user: string } }) {
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

  const [pageChain, setPageChain] = useState<any>();

  useEffect(() => {
    async function get() {
      const value = chains as any;
      const chain2 = value[params.network];

      setPageChain(chain2);
    }
    get();
  }, [params.network]);

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

  if (isLoadingPaymentVerifier) {
    return (
      <div className="bg-primary w-full flex flex-col flex-grow p-10 justify-center items-center">
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
        <p className="text-center text-4xl">{"Buying more hamsters."}</p>
      </div>
    );
  }

  let validationErrorOutput;

  if (pageChain === undefined) {
    validationErrorOutput = <UnknownNetworkCard chainName={params.network} />;
  } else if (paymentVerifier?.address === undefined) {
    validationErrorOutput = <NotSupportedNetworkCard chain={chainWithAttr} formattedNetwork={formattedNetwork} />;
  } else if (!isProfileSubscriptionActive) {
    validationErrorOutput = (
      <InactiveSubscriptionCard
        connectedAddress={account?.address || ""}
        profileAddress={profileAddress}
        network={formattedNetwork}
      />
    );
  }

  if (validationErrorOutput) {
    return (
      <div className={`bg-primary w-full flex flex-col flex-grow items-center justify-center`}>
        <NoticeCard>{validationErrorOutput}</NoticeCard>
      </div>
    );
  }

  console.log("render check");
  return (
    <div className={`bg-primary w-full flex flex-col flex-grow items-center justify-start`}>
      <Profile
        address={profileAddress}
        name={dummyUser.name}
        description={dummyUser.description}
        image={dummyUser.image}
      />
    </div>
  );
}
