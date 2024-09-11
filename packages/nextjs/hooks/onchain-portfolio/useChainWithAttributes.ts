import { useMemo } from "react";
import { Chain } from "viem/chains";
import { ChainWithAttributes, NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

export function useChainWithAttributes(chain: Chain): { chain: ChainWithAttributes } {
  return useMemo(
    () => ({
      chain: {
        ...chain,
        ...NETWORKS_EXTRA_DATA[chain.id],
      },
    }),
    [chain],
  );
}
