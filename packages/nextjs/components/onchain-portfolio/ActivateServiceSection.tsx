"use client";

import { ActivateServiceButton } from "./ActivateServiceButton";

type Props = {
  connectedAddress: string;
  profileAddress: string;
};

export const ActivateServiceSection = ({ connectedAddress, profileAddress }: Props) => {
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
      <ActivateServiceButton profileAddress={profileAddress} />
    </div>
  );
};
