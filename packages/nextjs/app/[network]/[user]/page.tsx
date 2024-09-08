"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, zeroAddress } from "viem";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { ActivateServiceSection } from "~~/components/onchain-portfolio/ActivateServiceSection";
import { Profile } from "~~/components/onchain-portfolio/Profile";
import { Address } from "~~/components/scaffold-eth";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import profilePicturePlaceholder from "~~/public/profile-icon-placeholder.gif";
import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const dummyUser = {
  address: zeroAddress,
  name: "Jake Homanics",
  description: "Onchain Developer focused on NFTs, DAOs, public goods, and open sourced tech.",
  image: profilePicturePlaceholder.src,
};

export default function UserPage({ params }: { params: { network: string; user: string } }) {
  const [profileAddress, setProfileAddress] = useState<string>(dummyUser.address);

  // const [isValidEns, setIsValidEns] = useState<boolean>();

  useEffect(() => {
    async function get() {
      let userAddress;

      if (isAddress(params.user)) {
        userAddress = params.user;
      } else {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(getAlchemyHttpUrl(mainnet.id)),
        });

        const addr = await publicClient.getEnsAddress({
          name: normalize(params.user),
        });

        userAddress = addr as string;
        // setIsValidEns(true);
      }

      setProfileAddress(userAddress);
    }
    get();
  }, [params.user]);

  const account = useAccount();

  const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const { data: isProfileSubscriptionActive } = useScaffoldReadContract({
    contractName: "PaymentVerifier",
    functionName: "getIsSubscriptionActive",
    args: [profileAddress],
  });

  //   const { data: paymentCadence } = useScaffoldReadContract({
  //     contractName: "PaymentVerifier",
  //     functionName: "getPaymentCadence",
  //   });

  // const { data: lastPaymentDate } = useScaffoldReadContract({
  //   contractName: "PaymentVerifier",
  //   functionName: "getLastPaymentDate",
  //   args: [profileAddress],
  // });

  // const hasBoughtBefore = lastPaymentDate === BigInt(0) ? false : true;

  const {
    //data: paymentVerifier,
    isLoading: isLoadingPaymentVerifier,
  } = useScaffoldContract({
    contractName: "PaymentVerifier",
  });

  if (isLoadingPaymentVerifier) {
    return (
      <div className="bg-secondary w-full flex flex-col flex-grow p-10 justify-center items-center">
        <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
        <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
        <p className="text-center text-4xl">{"Buying more hamsters."}</p>
      </div>
    );
  }

  // if (paymentVerifier?.address === undefined) {
  //   return (
  //     <div className="bg-secondary w-full p-10">
  //       <p className="text-center text-4xl">{formattedNetwork + " is not a supported network!"}</p>
  //     </div>
  //   );
  // }

  console.log("render check");
  return (
    <div
      className={`bg-secondary w-full flex flex-col flex-grow items-center ${
        isProfileSubscriptionActive ? "justify-start" : "justify-center"
      }`}
    >
      {isProfileSubscriptionActive ? (
        <Profile
          address={profileAddress}
          name={dummyUser.name}
          description={dummyUser.description}
          image={dummyUser.image}
        />
      ) : (
        <div className="flex flex-col bg-base-300 text-center rounded-xl items-center p-4 space-y-10">
          <Address address={profileAddress} size="3xl" />
          <div>
            <p className="text-3xl m-0">
              Network: <span className="text-success">{formattedNetwork}</span>
            </p>
            <p className="text-3xl m-0">
              Subscription Status: <span className="text-error">Inactive</span>
            </p>
          </div>
          <ActivateServiceSection connectedAddress={account?.address || ""} profileAddress={profileAddress || ""} />
        </div>
      )}
    </div>
    // <div className="flex flex-col items-center space-y-40 md:space-y-10">
    //   <div className="bg-secondary w-full p-10">
    //     {isProfileSubscriptionActive ? (
    //       <Profile
    //         address={profileAddress}
    //         name={dummyUser.name}
    //         description={dummyUser.description}
    //         image={dummyUser.image}
    //       />
    //     ) : (
    //       <div className="text-center mx-10 md:mx-[550px]">
    //         <ServiceNoticeSection
    //           network={formattedNetwork}
    //           address={profileAddress}
    //           hasBoughtBefore={hasBoughtBefore}
    //         />
    //       </div>
    //     )}
    //   </div>

    //   {!isProfileSubscriptionActive ? (
    //     <ActivateServiceSection
    //       connectedAddress={account?.address || ""}
    //       profileAddress={profileAddress || ""}
    //       hasBoughtBefore={hasBoughtBefore}
    //     />
    //   ) : (
    //     <></>
    //   )}
    // </div>
  );
}
