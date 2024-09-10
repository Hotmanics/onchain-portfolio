import { useEffect, useState } from "react";
import { createPublicClient, http, isAddress, zeroAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export function useProfileAddress(resolvingString: string) {
  const [profileAddress, setProfileAddress] = useState<string>(zeroAddress);

  // const [isValidEns, setIsValidEns] = useState<boolean>();

  const [isLoadingProfileAddress, setIsLoadingProfileAddress] = useState<boolean>(false);

  useEffect(() => {
    async function get() {
      setIsLoadingProfileAddress(true);
      let userAddress;

      if (isAddress(resolvingString)) {
        userAddress = resolvingString;
      } else {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(getAlchemyHttpUrl(mainnet.id)),
        });

        const addr = await publicClient.getEnsAddress({
          name: normalize(resolvingString),
        });

        userAddress = addr as string;
        // setIsValidEns(true);
      }

      setProfileAddress(userAddress);
      setIsLoadingProfileAddress(false);
    }
    get();
  }, [resolvingString]);

  return {
    profileAddress,
    isLoadingProfileAddress,
  };
}
