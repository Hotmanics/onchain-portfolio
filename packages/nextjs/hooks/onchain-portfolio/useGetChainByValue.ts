import { useEffect, useMemo, useState } from "react";
import * as chains from "viem/chains";
// import { Chain } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes, NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

export function useGetChainByValue(chainValue: string): { retrievedChain: ChainWithAttributes } {
  const [retrievedChain, setRetrievedChain] = useState<ChainWithAttributes>(scaffoldConfig.targetNetworks[0]);

  useEffect(() => {
    const anyChains = chains as any;
    const retrievedChain = anyChains[chainValue];
    setRetrievedChain(retrievedChain);
  }, [chainValue]);

  return useMemo(
    () => ({
      retrievedChain: {
        ...retrievedChain,
        ...NETWORKS_EXTRA_DATA[retrievedChain.id],
      },
    }),
    [retrievedChain],
  );

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {

  //   setRetrievedChain(selectedChain);
  // }, [chainValue]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const anyChains = chains as any;
  //   const selectedChain = anyChains[chainValue];

  //   setRetrievedChain(selectedChain);
  //   setIsLoading(false);
  // }, [chainValue]);

  // return {
  //   retrievedChain,
  //   isLoading,
  // };
}
