"use client";

import Link from "next/link";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

type Props = {
  chain: ChainWithAttributes;
  formattedNetwork: string;
};

export const NotSupportedNetworkCard = ({ chain, formattedNetwork }: Props) => {
  const networkColor = useNetworkColor(chain);

  return (
    <>
      <p className="text-center text-4xl">
        <span style={{ color: networkColor }}>{formattedNetwork}</span> is not a supported network!
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
    </>
  );
};
