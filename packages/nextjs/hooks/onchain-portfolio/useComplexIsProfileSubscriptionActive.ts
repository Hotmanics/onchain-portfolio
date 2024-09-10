import { useEffect, useState } from "react";
import { Chain } from "viem/chains";
import { useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import deployedContracts from "~~/contracts/deployedContracts";
import { enabledChains } from "~~/services/web3/wagmiConfig";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

export function useComplexIsProfileSubscriptionActive(chain: Chain, address: string) {
  const wagmiConfig = useConfig();

  const [isProfileSubscriptionActive, setIsProfileSubscriptionActive] = useState<boolean>();
  const [isLoadingIsProfileSubscriptionActive, setIsLoadingIsProfileSubscriptionActive] = useState<boolean>(false);

  useEffect(() => {
    async function get() {
      const contracts = deployedContracts as GenericContractsDeclaration | null;
      if (contracts === null) return;

      let presentChainId;

      for (let i = 0; i < enabledChains.length; i++) {
        if (enabledChains[i].id === chain?.id) {
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
        args: [address],
      });

      setIsProfileSubscriptionActive(result as boolean);
      setIsLoadingIsProfileSubscriptionActive(false);
    }
    get();
  }, [wagmiConfig, wagmiConfig?.chains?.length, chain?.id, address]);

  return {
    isProfileSubscriptionActive,
    isLoadingIsProfileSubscriptionActive,
  };
}
