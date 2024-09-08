"use client";

import { PfpCard } from "./PfpCard";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";

type Props = {
  address: string;
};

export const Profile = ({ address }: Props) => {
  return (
    <>
      <PfpCard
        address={address}
        name="Jacob Homanics"
        description="Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech."
        image={profilePicturePlaceholder.src}
      />
    </>
  );
};
