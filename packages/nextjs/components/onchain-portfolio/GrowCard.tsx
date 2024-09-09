"use client";

type Props = {
  justify: "start" | "center";
  children?: React.ReactNode;
};

export const GrowCard = ({ justify = "start", children }: Props) => {
  return <div className={`bg-primary w-full flex flex-col flex-grow items-center justify-${justify}`}>{children}</div>;
};
