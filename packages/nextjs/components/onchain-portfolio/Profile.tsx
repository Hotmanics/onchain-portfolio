"use client";

import { PfpCard } from "./PfpCard";

type Props = {
  address: string;
  name?: string;
  description?: string;
  image?: string;
};

export const Profile = ({ address, name, description, image }: Props) => {
  return (
    <>
      <PfpCard address={address} name={name} description={description} image={image} />
    </>
  );
};
