import { useEffect, useState } from "react";
import { useTargetNetwork } from "../scaffold-eth";
import { Chain, createPublicClient, http, isAddress, zeroAddress } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export function useProfileAddress(resolvingString: string, network?: Chain) {
  const [profileAddress, setProfileAddress] = useState<string>(zeroAddress);

  const [isValidEns, setIsValidEns] = useState<boolean>();

  const [isLoadingProfileAddress, setIsLoadingProfileAddress] = useState<boolean>(false);

  const { targetNetwork } = useTargetNetwork();

  const [selectedNetwork, setSelectedNetwork] = useState<Chain>();

  useEffect(() => {
    setSelectedNetwork(network ?? targetNetwork);
  }, [targetNetwork?.id, network?.id]);

  useEffect(() => {
    async function get() {
      if (!selectedNetwork) return;

      setIsLoadingProfileAddress(true);
      setIsValidEns(false);

      let userAddress: string = zeroAddress;

      if (isAddress(resolvingString)) {
        userAddress = resolvingString;
      } else {
        const publicClient =
          selectedNetwork.id === 31337
            ? createPublicClient({
                chain: sepolia,
                transport: http(getAlchemyHttpUrl(sepolia.id)),
              })
            : createPublicClient({
                chain: selectedNetwork,
                transport: http(getAlchemyHttpUrl(selectedNetwork.id)),
              });

        const addr = await publicClient.getEnsAddress({
          name: normalize(resolvingString),
        });

        if (addr !== null) {
          userAddress = addr as string;
          setIsValidEns(true);
        }
        // setIsValidEns(true);
      }

      setProfileAddress(userAddress);
      setIsLoadingProfileAddress(false);
    }
    get();
  }, [resolvingString, selectedNetwork?.id]);

  return {
    profileAddress,
    isLoadingProfileAddress,
    isValidEns,
    selectedNetwork,
  };
}
