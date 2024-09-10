"use client";

import { Address } from "../scaffold-eth";

// import { IconsLinksData } from "./config/socials.config";
// import { IconsLinks } from "./icons-links/IconLinks";

type Props = {
  name?: string | null;
  description?: string | null;
  image?: string | null;
  address?: string;
  size?: "sm" | "base" | "lg";
  // iconslinks?: any;
};

const sizeMap = {
  sm: 7,
  base: "w-[75px] md:w-[150px]",
  lg: "",
};

export const PfpCard = ({
  name,
  address,
  description,
  image, //iconslinks,
  size = "base",
}: Props) => {
  return (
    <div className="flex flex-col items-center text-center">
      {image ? (
        image?.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={"Profile Picture"} className={`rounded-full ${sizeMap[size]}`} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <div className="text-3xl">{name}</div>
      <Address address={address} />
      {/* <div className="pointer-events-auto border-4 border-primary rounded-lg p-2">
        <IconsLinks iconsLinks={iconslinks} size="sm" justify="center" />
      </div> */}
      <div className="text-xl m-2">{description}</div>
    </div>
  );
};
