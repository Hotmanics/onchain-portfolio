"use client";

import { Address } from "../scaffold-eth";
import { ActivateServiceSection } from "./ActivateServiceSection";
import { Chain } from "viem";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  network?: Chain;
};

export const InactiveSubscriptionCard = ({ connectedAddress, profileAddress, network }: Props) => {
  return (
    <>
      <Address address={profileAddress} size="3xl" />
      <div>
        <p className="text-3xl m-0">
          Network: <span className="text-success">{network?.name}</span>
        </p>
        <p className="text-3xl m-0">
          Subscription Status: <span className="text-error">Inactive</span>
        </p>
      </div>
      <ActivateServiceSection
        connectedAddress={connectedAddress || ""}
        profileAddress={profileAddress || ""}
        network={network}
      />
    </>
  );
};
