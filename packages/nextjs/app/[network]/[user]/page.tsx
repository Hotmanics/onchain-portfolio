"use client";

import {
  useEffect, //useMemo,
  useState,
} from "react";
import NetworkUser from "./_components/NetworkUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Chain,
  createClient, //createPublicClient,
  http, // zeroAddress,
} from "viem";
// import { isAddress } from "viem";
import { hardhat, mainnet } from "viem/chains";
import * as chains from "viem/chains";
// import { normalize } from "viem/ens";
import {
  WagmiProvider,
  createConfig, //useAccount
} from "wagmi";
// import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
// import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
// import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
// import { Profile } from "~~/components/onchain-portfolio/Profile";
// import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
// import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConnectors } from "~~/services/web3/wagmiConnectors";
// import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import {
  //NETWORKS_EXTRA_DATA,
  getAlchemyHttpUrl,
} from "~~/utils/scaffold-eth";

// const dummyUser = {
//   address: zeroAddress,
//   name: "Jake Homanics",
//   description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
//   image: profilePicturePlaceholder.src,
// };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function UserPage({ params }: { params: { network: string; user: string } }) {
  const [pageChain, setPageChain] = useState<Chain>(mainnet);

  const [wagmiConfig, setWagmiConfig] = useState<any>();

  useEffect(() => {
    async function get() {
      const value = chains as any;
      const chain2 = value[params.network];

      setPageChain(chain2);

      setWagmiConfig(
        createConfig({
          chains: [pageChain],
          connectors: wagmiConnectors,
          ssr: true,
          client({ chain }) {
            return createClient({
              chain,
              transport: http(getAlchemyHttpUrl(chain.id)),
              ...(chain.id !== (hardhat as Chain).id
                ? {
                    pollingInterval: scaffoldConfig.pollingInterval,
                  }
                : {}),
            });
          },
        }),
      );
    }
    get();
  }, [params.network, pageChain?.id]);

  console.log("render check");

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NetworkUser params={params} />
      </QueryClientProvider>
    </WagmiProvider>
    // <div className={`bg-primary w-full flex flex-col flex-grow items-center justify-start`}>
    //   <Profile
    //     address={profileAddress}
    //     name={dummyUser.name}
    //     description={dummyUser.description}
    //     image={dummyUser.image}
    //   />
    // </div>
  );
}
