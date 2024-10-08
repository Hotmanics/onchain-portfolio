"use client";

import { useEffect, useState } from "react";
import { AddressRaw } from "./AddressRaw";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address as AddressType, getAddress, isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

type AddressProps = {
  address?: AddressType;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  showIcon?: boolean;
  showAddress?: boolean;
  showCopy?: boolean;
};

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const Address = ({
  address,
  disableAddressLink,
  format,
  size = "base",
  showIcon = true,
  showAddress = true,
  showCopy = true,
}: AddressProps) => {
  const { targetNetwork } = useTargetNetwork();

  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const [addressCopied, setAddressCopied] = useState(false);
  const checkSumAddress = address ? getAddress(address) : undefined;

  const { data: fetchedEns } = useEnsName({
    address: checkSumAddress,
    chainId: targetNetwork.id,
    query: {
      enabled: isAddress(checkSumAddress ?? ""),
    },
  });
  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns ? normalize(fetchedEns) : undefined,
    chainId: targetNetwork.id,
    query: {
      enabled: Boolean(fetchedEns),
      gcTime: 30_000,
    },
  });

  useEffect(() => {
    setEnsAvatar(fetchedEnsAvatar);
  }, [fetchedEnsAvatar]);

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

  return (
    <div className="flex items-center flex-shrink-0 space-x-1">
      {showIcon ? (
        <div className="flex-shrink-0">
          <BlockieAvatar
            address={checkSumAddress}
            ensImage={ensAvatar}
            size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
          />
        </div>
      ) : (
        <></>
      )}
      {showAddress ? <AddressRaw address={address} format={format} disableAddressLink={disableAddressLink} /> : <></>}
      {showCopy ? (
        addressCopied ? (
          <CheckCircleIcon
            className="text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer flex-shrink-0"
            aria-hidden="true"
          />
        ) : (
          <CopyToClipboard
            text={checkSumAddress}
            onCopy={() => {
              setAddressCopied(true);
              setTimeout(() => {
                setAddressCopied(false);
              }, 800);
            }}
          >
            <DocumentDuplicateIcon
              className="text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer flex-shrink-0"
              aria-hidden="true"
            />
          </CopyToClipboard>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
