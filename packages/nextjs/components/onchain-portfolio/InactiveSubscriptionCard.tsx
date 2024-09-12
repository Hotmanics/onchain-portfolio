"use client";

import { Address } from "../scaffold-eth";
import { ActivateServiceSection } from "./ActivateServiceSection";
import { Chain } from "viem";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  profileAddress2: string;
  network?: Chain;
  network2?: Chain;
  onClick?: any;
};

export const InactiveSubscriptionCard = ({
  connectedAddress,
  profileAddress,
  profileAddress2,
  network,
  network2,
  onClick,
}: Props) => {
  return (
    <>
      <Address address={profileAddress} chain={network} size="3xl" />
      <div>
        <p className="text-3xl m-0">
          Network: <span className="text-success">{network2?.name}</span>
        </p>
        <p className="text-3xl m-0">
          Subscription Status: <span className="text-error">Inactive</span>
        </p>
      </div>
      <ActivateServiceSection
        connectedAddress={connectedAddress || ""}
        profileAddress={profileAddress2 || ""}
        network={network2}
        onClick={onClick}
      />
    </>
  );
};
