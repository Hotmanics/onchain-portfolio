import { useEffect, useState } from "react";
import * as chains from "viem/chains";

export function useGetChainByValue(chainValue: string) {
  const [retrievedChain, setRetrievedChain] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const anyChains = chains as any;
    const selectedChain = anyChains[chainValue];

    setRetrievedChain(selectedChain);
    setIsLoading(false);
  }, [chainValue]);

  return {
    retrievedChain,
    isLoading,
  };
}
