"use client";

type Props = {
  chainName: string;
};

export const UnknownNetworkCard = ({ chainName }: Props) => {
  return (
    <>
      <p className="text-xl m-0">
        {'"'}
        <span className="text-[#bbbbbb]">{chainName}</span>
        {'"'} is not a valid network.
      </p>
      <p className="text-xl m-0">Please correct any mistakes or select a network from this dropdown.</p>
      <div>
        <p className="text-xl m-0">Select another network</p>
        <p className="text-md m-0">TODO:// Dropdown - Select another network</p>
      </div>
    </>
  );
};
