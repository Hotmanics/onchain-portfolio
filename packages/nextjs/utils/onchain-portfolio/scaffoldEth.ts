import { getChainByName } from "./viemHelpers";
import { Chain } from "viem";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

export function getChainWithAttributes(chain: Chain) {
  return chain
    ? {
        ...chain,
        ...NETWORKS_EXTRA_DATA[chain?.id],
      }
    : undefined;
}

export function getChainWithAttributesByName(name: string) {
  const chain = getChainByName(name);
  return getChainWithAttributes(chain);
}
