"use client";

import {
  useEffect, // useMemo,
  useState,
} from "react";
// import { useTheme } from "next-themes";
import {
  //Chain,
  createPublicClient,
  http,
  isAddress,
} from "viem";
import { foundry, sepolia } from "viem/chains";
import { normalize } from "viem/ens";
// import { useEffect } from "react";
import {
  useAccount, //, useEnsAddress
} from "wagmi";
// import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
// import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
// import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
// import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
// import { Profile } from "~~/components/onchain-portfolio/Profile";
// import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
import { Address } from "~~/components/scaffold-eth";
// import { dummyUser } from "~~/components/onchain-portfolio/test-data/dummyUser";
// import { useComplexIsProfileSubscriptionActive } from "~~/hooks/onchain-portfolio/useComplexIsProfileSubscriptionActive";
import { useGetChainByValue } from "~~/hooks/onchain-portfolio/useGetChainByValue";
// import { useProfileAddress } from "~~/hooks/onchain-portfolio/useProfileAddress";
import {
  useNetworkColor, // useScaffoldContract,
  // useScaffoldReadContract, // useScaffoldWriteContract,
  // useTargetNetwork,
} from "~~/hooks/scaffold-eth";
// import { wagmiConfig } from "~~/services/web3/wagmiConfig";
// import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";
import { NETWORKS_EXTRA_DATA, getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const spoofChain = { ...sepolia, ...NETWORKS_EXTRA_DATA[sepolia.id] };

export default function UserPage({ params }: { params: { chain: string; observedAccount: string } }) {
  // const { spoofChainRaw: spoofChain } = useMemo(
  //   () => ({
  //     spoofChainRaw: {
  //       ...spoofChainRaw,
  //       ...NETWORKS_EXTRA_DATA[spoofChainRaw.id],
  //     },
  //   }),
  //   [spoofChainRaw],
  // );

  console.log(spoofChain);
  const spoofedNetworkColor = useNetworkColor(spoofChain);

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

  // useEffect(() => {
  //   const result = loadBurnerSK();
  //   console.log(result);
  // }, []);
  // const account = useAccount();

  const { retrievedChain: retrievedChainFromUrl } = useGetChainByValue(params.chain);

  const account = useAccount();

  const [finalizedObservedAddress, setFinalizedObservedAddress] = useState<string>();
  // const [finalizedEnsProfileAccount, setFinalizedEnsProfileAccount] = useState<string | null>();

  useEffect(() => {
    async function get() {
      //if page observed account IS an address
      if (isAddress(params.observedAccount)) {
        //then set finalized observed account
        setFinalizedObservedAddress(params.observedAccount);
      }
      //else page observed account IS NOT an address
      else {
        //if page chain IS foundry
        if (retrievedChainFromUrl?.id === foundry.id) {
          //THEN spoof sepolia ens profile
          const publicClient = createPublicClient({
            chain: spoofChain,
            transport: http(getAlchemyHttpUrl(spoofChain.id)),
          });

          const resolvedAddr = await publicClient.getEnsAddress({
            name: normalize(params.observedAccount),
          });

          console.log(resolvedAddr);

          if (resolvedAddr !== null) setFinalizedObservedAddress(resolvedAddr);

          // setFinalizedEnsProfileAccount(resolvedAddr);
        }

        //if site user wallet is not connected
        if (account?.address === undefined) {
        }
      }
    }
    get();
  }, [account?.address, retrievedChainFromUrl?.id]);

  useEffect(() => {
    async function get() {
      if (retrievedChainFromUrl?.id === foundry.id) {
        const publicClient = createPublicClient({
          chain: spoofChain,
          transport: http(getAlchemyHttpUrl(spoofChain.id)),
        });

        const nickname = await publicClient.getEnsText({ name: normalize(params.observedAccount), key: "name" });
        const description = await publicClient.getEnsText({
          name: normalize(params.observedAccount),
          key: "description",
        });
        const image = await publicClient.getEnsAvatar({ name: normalize(params.observedAccount) });

        console.log(nickname);
        console.log(description);
        console.log(image);
      }
    }
    get();
  }, [params.observedAccount, retrievedChainFromUrl?.id]);

  const networkColor = useNetworkColor(retrievedChainFromUrl);

  console.log(finalizedObservedAddress);

  return (
    <div className="flex flex-col flex-grow bg-primary">
      <p>
        This page is loading data from the <span style={{ color: networkColor }}>{retrievedChainFromUrl?.name}</span>{" "}
        network.
      </p>
      <p>
        This page is spoofing some data from the <span style={{ color: spoofedNetworkColor }}>{spoofChain.name}</span>{" "}
        network.
      </p>
      <Address address={finalizedObservedAddress} chain={spoofChain} />
    </div>
  );

  // useEffect(() => {
  //   async function get() {
  //     if (retrievedChainFromUrl === undefined) return;

  //     if (isAddress(params.user)) {
  //       setSomeAddress(params.user);
  //     } else {
  //       const publicClient = createPublicClient({
  //         chain: retrievedChainFromUrl?.id === 31337 ? sepolia : retrievedChainFromUrl,
  //         transport: http(
  //           getAlchemyHttpUrl(retrievedChainFromUrl?.id === 31337 ? sepolia.id : retrievedChainFromUrl.id),
  //         ),
  //       });

  //       const resolvedAddr = await publicClient.getEnsAddress({
  //         name: normalize(params.user),
  //       });

  //       setSomeAddress(resolvedAddr);
  //     }
  //   }
  //   get();
  // }, [retrievedChainFromUrl?.id, params.user]);

  // useEffect(() => {
  //   async function get() {
  //     if (retrievedChainFromUrl === undefined) return;

  //     if (!isAddress(params.user)) {
  //       const publicClient = createPublicClient({
  //         chain: retrievedChainFromUrl,
  //         transport: http(getAlchemyHttpUrl(retrievedChainFromUrl?.id)),
  //       });

  //       const addr = await publicClient.getEnsAddress({
  //         name: normalize(params.user),
  //       });

  //       setReturnedAddress(addr as string);
  //     }
  //   }
  //   get();
  // }, [retrievedChainFromUrl?.id]);

  // const { profileAddress, isLoadingProfileAddress, selectedNetwork } = useProfileAddress(params.user, retrievedChain);

  // console.log(selectedNetwork);

  // const { data: profileData, refetch: refetchProfileData } = useScaffoldReadContract({
  //   contractName: "Profile",
  //   functionName: "getProfile",
  //   args: [profileAddress],
  // });

  // const [isLoadingEns, setIsLoadingEns] = useState(false);
  // const [nickname, setNickname] = useState<string | null>();
  // const [description, setDescription] = useState<string | null>();
  // const [image, setImage] = useState<string | null>();
  // const [isUsingProfile, setIsUsingProfile] = useState(false);
  // const [isUsingEns, setIsUsingEns] = useState(false);

  // useEffect(() => {
  //   async function get() {
  //     if (!isValidEns || !profileData || profileData?.[3]) return;

  //     setIsLoadingEns(true);

  //     const publicClient = createPublicClient({
  //       chain: targetNetwork,
  //       transport: http(getAlchemyHttpUrl(targetNetwork.id)),
  //     });

  //     const nickname = await publicClient.getEnsText({ name: normalize(params.user), key: "name" });
  //     const description = await publicClient.getEnsText({ name: normalize(params.user), key: "description" });
  //     const image = await publicClient.getEnsAvatar({ name: normalize(params.user) });

  //     console.log(profileData?.[3]);
  //     setNickname(nickname);
  //     setDescription(description);
  //     setImage(image);
  //     setIsLoadingEns(false);
  //   }
  //   get();
  // }, [isValidEns, profileData, profileData?.[3]]);
  // const { targetNetwork } = useTargetNetwork();

  // useEffect(() => {
  //   async function get() {
  //     if (profileData?.[3] === undefined) return;
  //     if (profileData?.[4] === undefined) return;

  //     if (profileData?.[3]) {
  //       setNickname(profileData?.[0]);
  //       setDescription(profileData?.[1]);
  //       setImage(profileData?.[2]);
  //       setIsUsingProfile(profileData?.[3]);
  //       setIsUsingEns(profileData?.[4]);
  //     } else {
  //       setIsLoadingEns(true);

  //       let selectedNetwork = targetNetwork.id === 31337 ? sepolia : targetNetwork;

  //       const publicClient = createPublicClient({
  //         chain: selectedNetwork,
  //         transport: http(getAlchemyHttpUrl(selectedNetwork.id)),
  //       });

  //       const nickname = await publicClient.getEnsText({ name: normalize(params.user), key: "name" });
  //       // const description = await publicClient.getEnsText({ name: normalize(params.user), key: "description" });
  //       // const image = await publicClient.getEnsAvatar({ name: normalize(params.user) });
  //       setNickname(nickname);
  //       // setDescription(description);
  //       // setImage(image);
  //       // setIsUsingEns(profileData?.[4]);
  //       setIsLoadingEns(false);
  //     }
  //   }
  //   get();
  // }, [
  //   params.user,
  //   profileData,
  //   targetNetwork,
  //   targetNetwork?.id,
  //   profileData?.[0],
  //   profileData?.[1],
  //   profileData?.[2],
  //   profileData?.[3],
  // ]);

  // const formattedNetwork = insertSpaces(params.network).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  // const { retrievedChain, isLoading: isLoadingRetrievedChain } = useGetChainByValue(params.network);

  // const { data: paymentVerifier, isLoading: isLoadingPaymentVerifier } = useScaffoldContract({
  //   contractName: "PaymentVerifier",
  //   chain: retrievedChain,
  // });

  // const { isProfileSubscriptionActive, isLoadingIsProfileSubscriptionActive, refetch } =
  //   useComplexIsProfileSubscriptionActive(retrievedChain, profileAddress);

  // // const { writeContractAsync: writeProfileAsync } = useScaffoldWriteContract("Profile");

  // async function refresh() {
  //   await refetch();
  //   await refetchProfileData();
  // }

  // let justify: "start" | "center" = "start";
  // let output;

  // const isLoading =
  //   isLoadingPaymentVerifier ||
  //   isLoadingRetrievedChain ||
  //   isLoadingIsProfileSubscriptionActive ||
  //   isLoadingProfileAddress ||
  //   isLoadingEns;

  // if (isLoading) {
  //   justify = "center";
  //   output = (
  //     <>
  //       <p className="text-center text-4xl">{"Spinning up the hamsters."}</p>
  //       <p className="text-center text-4xl">{"Tricking the hamsters with more cheese."}</p>
  //       <p className="text-center text-4xl">{"Buying more hamsters."}</p>
  //     </>
  //   );
  // } else {
  //   if (retrievedChain === undefined) {
  //     output = (
  //       <NoticeCard>
  //         <UnknownNetworkCard chainName={params.network} />
  //       </NoticeCard>
  //     );
  //   } else if (paymentVerifier?.address === undefined) {
  //     output = (
  //       <NoticeCard>
  //         <NotSupportedNetworkCard chain={retrievedChain} formattedNetwork={formattedNetwork} />
  //       </NoticeCard>
  //     );
  //   } else if (!isProfileSubscriptionActive) {
  //     output = (
  //       <NoticeCard>
  //         <InactiveSubscriptionCard
  //           connectedAddress={account?.address || ""}
  //           profileAddress={profileAddress}
  //           network={retrievedChain}
  //           onClick={refresh}
  //         />
  //       </NoticeCard>
  //     );
  //   }

  // if (output) {
  //   justify = "center";
  // }

  // if (!output) {
  //   // async function setProfileIsNotUsingEns(value: boolean) {
  //   //   // await writeProfileAsync({
  //   //   //   functionName: "setProfile",
  //   //   //   args: [profileData?.[0], profileData?.[1], profileData?.[2], value],
  //   //   // });
  //   // }
  //   // output = (
  //   //   <Profile
  //   //     address={profileAddress}
  //   //     name={nickname}
  //   //     description={description}
  //   //     image={image}
  //   //     isUsingProfile={isUsingProfile}
  //   //     isUsingEns={isUsingEns}
  //   //     // onCheckChange={setProfileIsNotUsingEns}
  //   //     refetch={refresh}
  //   //   />
  //   // );
  // }
  // }

  console.log("render check");
  return <></>;
  // return <GrowCard justify={justify}>{output}</GrowCard>;
}
