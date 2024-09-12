import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useTheme } from "next-themes";
import { Chain } from "viem/chains";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

export const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

export function getNetworkColor(network: ChainWithAttributes, isDarkMode: boolean) {
  const colorConfig = network.color ?? DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}

/**
 * Gets the color of the target network
 */
export const useNetworkColor = (chain?: Chain | undefined) => {
  const { resolvedTheme } = useTheme();
  const { targetNetwork } = useTargetNetwork();

  const isDarkMode = resolvedTheme === "dark";

  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (chain === undefined) return;

    setColor(getNetworkColor(chain ?? targetNetwork, isDarkMode));
  }, [chain, chain?.id, targetNetwork, targetNetwork?.id, isDarkMode]);

  return color;
};
