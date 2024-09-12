"use client";

import "react";
// import { useEffect } from "react";
// import { useTheme } from "next-themes";
import {
  isAddress, // PublicClient, //Chain,
  // createPublicClient,
  // http,
  // isAddress,
  zeroAddress,
} from "viem";
import { foundry, sepolia } from "viem/chains";
// import * as chains from "viem/chains";
// import { Chain } from "viem/chains";
import { normalize } from "viem/ens";
// import { useEffect } from "react";
import {
  useAccount, //useAccount,
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
  useEnsText, // useEnsAvatar, // useEnsName,
  // useEnsText, // usePublicClient
} from "wagmi";
import { Address } from "~~/components/scaffold-eth";
// import { getPublicClient } from "wagmi/actions";
// import { GrowCard } from "~~/components/onchain-portfolio/GrowCard";
// import { InactiveSubscriptionCard } from "~~/components/onchain-portfolio/InactiveSubscriptionCard";
// import { NotSupportedNetworkCard } from "~~/components/onchain-portfolio/NotSupportedNetworkCard";
// import { NoticeCard } from "~~/components/onchain-portfolio/NoticeCard";
// import { Profile } from "~~/components/onchain-portfolio/Profile";
// import { UnknownNetworkCard } from "~~/components/onchain-portfolio/UnknownNetworkCard";
// import { Address } from "~~/components/scaffold-eth";
// import { dummyUser } from "~~/components/onchain-portfolio/test-data/dummyUser";
// import { useComplexIsProfileSubscriptionActive } from "~~/hooks/onchain-portfolio/useComplexIsProfileSubscriptionActive";
// import { useProfileAddress } from "~~/hooks/onchain-portfolio/useProfileAddress";
import "~~/hooks/scaffold-eth";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getChainWithAttributes } from "~~/utils/onchain-portfolio/scaffoldEth";
import { getChainByName } from "~~/utils/onchain-portfolio/viemHelpers";

// import { wagmiConfig } from "~~/services/web3/wagmiConfig";
// import insertSpaces from "~~/utils/onchain-portfolio/textManipulation";

// const ensSpoofChain = { ...sepolia, ...NETWORKS_EXTRA_DATA[sepolia.id] };
const ensSpoofChain = getChainWithAttributes(sepolia);

export default function UserPage({ params }: { params: { chain: string; account: string } }) {
  // const spoofedNetworkColor = useNetworkColor(spoofChain);

  const paramsChain = getChainByName(params.chain);

  const isFoundry = paramsChain?.id === foundry.id;

  const selectedEnsChain = isFoundry && !isAddress(params.account) ? ensSpoofChain : paramsChain;
  const { data: resolvedEnsAddress } = useEnsAddress({
    name: normalize(params.account),
    chainId: selectedEnsChain?.id,
  });

  const { data: resolvedEnsName } = useEnsName({ address: params.account, chainId: selectedEnsChain?.id });

  let usableEnsName = resolvedEnsName;
  let authenticAddress = "";
  const account = useAccount();

  if (resolvedEnsAddress && resolvedEnsName === null) {
    // Valid network with params.account == ens name.
    //address: resolvedEnsAddress
    //ensName: params.account

    authenticAddress = isFoundry ? account?.address ?? zeroAddress : resolvedEnsAddress;
    usableEnsName = params.account;

    console.log(1);
  }

  if (resolvedEnsName && resolvedEnsAddress === null) {
    // Valid network with params.account == address that DOES have a registered ENS name.
    //address: params.account
    //ensName: resolvedEnsName

    authenticAddress = params.account;
    console.log(2);
  }

  if (resolvedEnsAddress === null && resolvedEnsName === null) {
    // Valid Network with params.account == address that DOES NOT have a registered ENS name.
    //address: params.account
    //ensName: undefined

    authenticAddress = params.account as `0x${string}`;

    console.log(3);
  }

  if (resolvedEnsAddress === undefined && resolvedEnsName === undefined) {
    //Invalid Network.
    console.log(4);
  }

  console.log(usableEnsName);

  const { data: ensNickname } = useEnsText({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
    key: "name",
  });

  const { data: ensDescription } = useEnsText({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
    key: "description",
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: normalize(usableEnsName || ""),
    chainId: selectedEnsChain?.id,
  });

  console.log(ensNickname);
  console.log(ensDescription);
  console.log(ensAvatar);

  console.log(authenticAddress);

  const paramsChainColor = useNetworkColor(getChainWithAttributes(paramsChain));
  const ensSpoofChainColor = useNetworkColor(ensSpoofChain);

  return (
    <div className="flex flex-col flex-grow bg-primary">
      {paramsChain ? (
        <p>
          This page is loading smart contract data from the{" "}
          <span style={{ color: paramsChainColor }}>{paramsChain?.name}</span> network.
        </p>
      ) : (
        <></>
      )}
      {selectedEnsChain ? (
        <>
          <p>
            This page is loading ENS data from the{" "}
            <span style={{ color: ensSpoofChainColor }}>{selectedEnsChain?.name}</span> network.
          </p>
          <Address address={authenticAddress} chain={selectedEnsChain} />
        </>
      ) : (
        <></>
      )}
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
