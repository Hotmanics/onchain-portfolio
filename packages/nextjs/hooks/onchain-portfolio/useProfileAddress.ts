import { useEffect, useState } from "react";
import { useTargetNetwork } from "../scaffold-eth";
import { createPublicClient, http, isAddress, zeroAddress } from "viem";
import { normalize } from "viem/ens";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export function useProfileAddress(resolvingString: string) {
  const [profileAddress, setProfileAddress] = useState<string>(zeroAddress);

  const [isValidEns, setIsValidEns] = useState<boolean>();

  const [isLoadingProfileAddress, setIsLoadingProfileAddress] = useState<boolean>(false);

  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    async function get() {
      setIsLoadingProfileAddress(true);
      setIsValidEns(false);

      let userAddress: string = zeroAddress;

      if (isAddress(resolvingString)) {
        userAddress = resolvingString;
      } else {
        if (targetNetwork.id !== 31337) {
          const publicClient = createPublicClient({
            chain: targetNetwork,
            transport: http(getAlchemyHttpUrl(targetNetwork.id)),
          });

          const addr = await publicClient.getEnsAddress({
            name: normalize(resolvingString),
          });

          if (addr !== null) {
            userAddress = addr as string;
            setIsValidEns(true);
          }
        }

        // setIsValidEns(true);
      }

      setProfileAddress(userAddress);
      setIsLoadingProfileAddress(false);
    }
    get();
  }, [resolvingString, targetNetwork.id]);

  return {
    profileAddress,
    isLoadingProfileAddress,
    isValidEns,
  };
}
