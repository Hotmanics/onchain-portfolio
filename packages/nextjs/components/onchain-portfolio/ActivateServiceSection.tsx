"use client";

import { ActivateServiceButton } from "./ActivateServiceButton";

type Props = {
  connectedAddress: string;
  profileAddress: string;
  hasBoughtBefore: boolean;
};

export const ActivateServiceSection = ({ connectedAddress, profileAddress, hasBoughtBefore }: Props) => {
  return (
    <div className="flex flex-col items-center">
      {connectedAddress !== profileAddress ? <p>{"Feeling generous? Pay for their service fee."}</p> : <></>}
      <ActivateServiceButton profileAddress={profileAddress} hasBoughtBefore={hasBoughtBefore} />
    </div>
  );
};
