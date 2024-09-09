"use client";

type Props = {
  children?: React.ReactNode;
};

export const NoticeCard = ({ children }: Props) => {
  return (
    <div className="flex flex-col bg-secondary text-center rounded-xl items-center p-4 space-y-10">{children}</div>
  );
};
