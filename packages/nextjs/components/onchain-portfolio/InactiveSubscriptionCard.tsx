"use client";

import { Address } from "../scaffold-eth";
import { ActivateServiceSection } from "./ActivateServiceSection";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  network: string;
};

export const InactiveSubscriptionCard = ({ connectedAddress, profileAddress, network }: Props) => {
  return (
    <div className="flex flex-col bg-base-300 text-center rounded-xl items-center p-4 space-y-10">
      <Address address={profileAddress} size="3xl" />
      <div>
        <p className="text-3xl m-0">
          Network: <span className="text-success">{network}</span>
        </p>
        <p className="text-3xl m-0">
          Subscription Status: <span className="text-error">Inactive</span>
        </p>
      </div>
      <ActivateServiceSection connectedAddress={connectedAddress || ""} profileAddress={profileAddress || ""} />
    </div>
  );
};
