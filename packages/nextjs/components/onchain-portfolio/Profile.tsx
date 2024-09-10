"use client";

import { useEffect, useState } from "react";
import { InputBase } from "../scaffold-eth";
import { PfpCard } from "./PfpCard";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Props = {
  address: string;
  name?: string;
  description?: string;
  image?: string;
};

export const Profile = ({ address, name, description, image }: Props) => {
  const account = useAccount();

  const [isEditingPage, setIsEditingPage] = useState(false);

  const [nameValue, setNameValue] = useState<string>(name || "");
  const [descriptionValue, setDescriptionValue] = useState<string>(description || "");
  const [imageUrlValue, setImageUrlValue] = useState<string>(image || "");

  useEffect(() => {
    if (!name) return;
    setNameValue(name);
  }, [name]);

  useEffect(() => {
    if (!description) return;
    setDescriptionValue(description);
  }, [description]);

  useEffect(() => {
    if (!image) return;
    setImageUrlValue(image);
  }, [image]);

  console.log(nameValue);

  const { writeContractAsync: writeProfileAsync } = useScaffoldWriteContract("DummyProfile");

  const [profileUpdated, setProfileUpdated] = useState(false);

  let output;
  if (!isEditingPage) {
    output = (
      <>
        <PfpCard address={address} name={name} description={description} image={image} />
        {account?.address === address ? (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setIsEditingPage(true);
            }}
          >
            Edit Page
          </button>
        ) : (
          <></>
        )}
      </>
    );
  } else {
    output = (
      <div className="flex flex-col items-center space-y-4">
        {profileUpdated ? <p>Profile Succesfully updated!</p> : <></>}

        <div className="flex flex-col items-center bg-secondary rounded-xl p-4">
          <p>Profile</p>
          <div className="flex flex-col gap-1.5 w-[400px]">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">Name</span>
            </div>
            <InputBase
              value={nameValue}
              onChange={updatedValue => {
                setNameValue(updatedValue);
              }}
              placeholder="Tony"
            />
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">Description</span>
            </div>
            <InputBase
              value={descriptionValue}
              onChange={updatedValue => {
                setDescriptionValue(updatedValue);
              }}
              placeholder="This is a long description."
            />

            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">Image URL</span>
            </div>
            <InputBase
              value={imageUrlValue}
              onChange={updatedValue => {
                setImageUrlValue(updatedValue);
              }}
              placeholder="ipfs://Qm12eqwkjn12"
            />

            <button
              className="btn btn-primary"
              onClick={async () => {
                await writeProfileAsync({
                  functionName: "setProfile",
                  args: [nameValue, descriptionValue, imageUrlValue],
                });
                setProfileUpdated(true);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-1">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setIsEditingPage(false);
            }}
          >
            Exit Edit Mode
          </button>
        </div>
      </div>
    );
  }

  return <div className="mt-4 w-full flex flex-col items-center">{output}</div>;
};
