"use client";

import { Address } from "../scaffold-eth";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getChainWithAttributes } from "~~/utils/onchain-portfolio/scaffoldEth";

type Props = {
  isDebugging: boolean;
  paramsChain: any;
  selectedEnsChain: any;
  authenticAddress: string;
};

export const DebuggingSection = ({ isDebugging, paramsChain, selectedEnsChain, authenticAddress }: Props) => {
  const paramsChainColor = useNetworkColor(getChainWithAttributes(paramsChain));

  const selectedEnsChainColor = useNetworkColor(
    selectedEnsChain ? getChainWithAttributes(selectedEnsChain) : undefined,
  );

  let debuggingSection1;
  let debuggingSection2;
  if (isDebugging) {
    if (paramsChain) {
      debuggingSection1 = (
        <p>
          This page is loading smart contract data from the{" "}
          <span style={{ color: paramsChainColor }}>{paramsChain?.name}</span> network.
        </p>
      );
    }

    if (selectedEnsChain) {
      debuggingSection2 = (
        <>
          <p>
            This page is loading ENS data from the{" "}
            <span style={{ color: selectedEnsChainColor }}>{selectedEnsChain?.name}</span> network.
          </p>
          <Address address={authenticAddress} chain={selectedEnsChain} />
        </>
      );
    }
  }

  return (
    <>
      {debuggingSection1}
      {debuggingSection2}
    </>
  );
};
