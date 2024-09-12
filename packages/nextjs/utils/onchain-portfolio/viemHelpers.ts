import * as chains from "viem/chains";

export function getChainByName(name: string) {
  return chains[name as keyof typeof chains];
}
