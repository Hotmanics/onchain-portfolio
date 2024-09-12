"use client";

import { PfpCard } from "./PfpCard";

type Props = {
  address: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
};

export const Profile = ({ address, name, description, image }: Props) => {
  return (
    <div className="mt-4 w-full flex flex-col items-center">
      <PfpCard address={address} name={name} description={description} image={image} />
    </div>
  );
};
