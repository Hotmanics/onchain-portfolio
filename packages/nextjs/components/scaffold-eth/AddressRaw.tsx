"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Address as AddressType, Chain, getAddress, isAddress } from "viem";
import { hardhat } from "viem/chains";
import { useEnsName } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type AddressProps = {
  address?: AddressType;
  chain?: Chain;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
};
/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const AddressRaw = ({ address, chain, disableAddressLink, format, size = "base" }: AddressProps) => {
  const [ens, setEns] = useState<string | null>();
  const checkSumAddress = address ? getAddress(address) : undefined;

  const { targetNetwork } = useTargetNetwork();
  const selectedNetwork = chain ?? targetNetwork;
  const { data: fetchedEns } = useEnsName({
    address: checkSumAddress,
    chainId: selectedNetwork.id,
    query: {
      enabled: isAddress(checkSumAddress ?? ""),
    },
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    setEns(fetchedEns);
  }, [fetchedEns]);

  // Skeleton UI
  if (!checkSumAddress) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(checkSumAddress)) {
    return <span className="text-error">Wrong address</span>;
  }

  const blockExplorerAddressLink = getBlockExplorerAddressLink(selectedNetwork, checkSumAddress);
  let displayAddress = checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = checkSumAddress;
  }

  return (
    <>
      {disableAddressLink ? (
        <span className={`text-${size} font-normal`}>{displayAddress}</span>
      ) : selectedNetwork.id === hardhat.id ? (
        <span className={`text-${size} font-normal hover:underline`}>
          <Link href={blockExplorerAddressLink}>{displayAddress}</Link>
        </span>
      ) : (
        <a
          className={`text-${size} font-normal hover:underline`}
          target="_blank"
          href={blockExplorerAddressLink}
          rel="noopener noreferrer"
        >
          {displayAddress}
        </a>
      )}
    </>
  );
};
