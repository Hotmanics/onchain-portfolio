"use client";

import { ActivateServiceButton } from "./ActivateServiceButton";
import { Chain } from "viem";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  network?: Chain;
};

export const ActivateServiceSection = ({ connectedAddress, profileAddress, network }: Props) => {
  return (
    <div className="flex flex-col items-center">
      {connectedAddress !== profileAddress ? (
        <>
          <p className="text-2xl m-0">{"Feeling generous?"}</p>
          <p className="text-2xl m-0">{"Pay for their service fee."}</p>
        </>
      ) : (
        <></>
      )}
      <ActivateServiceButton profileAddress={profileAddress} network={network} />
    </div>
  );
};
