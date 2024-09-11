import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useTheme } from "next-themes";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

export const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

export function getNetworkColor(network: ChainWithAttributes, isDarkMode: boolean) {
  const colorConfig = network.color ?? DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}

/**
 * Gets the color of the target network
 */
export const useNetworkColor = (network?: ChainWithAttributes, theme?: string | undefined) => {
  const { resolvedTheme } = useTheme();
  const { targetNetwork } = useTargetNetwork();

  const selectedNetwork = network ?? targetNetwork;
  const selectedTheme = theme ?? resolvedTheme;

  const [resolvedColor, setResolvedColor] = useState<string>();

  useEffect(() => {
    if (selectedNetwork === undefined) return;

    const isDarkMode = selectedTheme === "dark";
    setResolvedColor(getNetworkColor(selectedNetwork, isDarkMode));
  }, [selectedNetwork, selectedNetwork?.id, selectedTheme]);

  return resolvedColor;
};
