"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Chain } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

type Props = {
  chain: Chain;
  formattedNetwork: string;
};

export const NotSupportedNetworkCard = ({ chain }: Props) => {
  const chainWithAttr = useMemo(
    () => ({
      ...chain,
      ...NETWORKS_EXTRA_DATA[chain?.id],
    }),
    [chain],
  );

  const networkColor = useNetworkColor(chainWithAttr);

  return (
    <>
      <p className="text-center text-4xl">
        <span style={{ color: networkColor }}>{chain.name}</span> is not a supported network!
      </p>

      <div>
        <p className="text-center text-xl m-0">Request a chain</p>
        <Link
          href="https://github.com/hotmanics/onchain-portfolio/issues"
          target="#"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          https://github.com/hotmanics/onchain-portfolio/issues
        </Link>
      </div>

      <div>
        <p className="text-xl m-0">Select another network</p>
        <p className="text-md m-0">TODO:// Dropdown - Select another network</p>
      </div>
    </>
  );
};
