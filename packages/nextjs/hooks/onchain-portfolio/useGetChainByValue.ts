import { useEffect, useState } from "react";
import * as chains from "viem/chains";
import { Chain } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

export function useGetChainByName(name: string): { chain: Chain } {
  const [chain, setChain] = useState<Chain>(scaffoldConfig.targetNetworks[0]);

  useEffect(() => {
    const anyChains = chains as any;
    const retrievedChain = anyChains[name];
    setChain(retrievedChain);
  }, [name]);

  return { chain };

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
