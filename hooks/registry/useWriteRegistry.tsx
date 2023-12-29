import { useContext } from "react";
import GlobalContext from "../context/ContextAggregator";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { MemberArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { ProfileMetadataArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { ProfileNameArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { ProfileAndAddressArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";

// Custom hook for retrieving registry, provider and signer from context
const useGlobalContext = () => {
  return useContext(GlobalContext);
};

// Custom hook to retrieve registry write functions
const useWriteRegistry = () => {
  const { registry, signer } = useGlobalContext();

  // To create a new profile using the createProfile function
  const createProfile = async (args: CreateProfileArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.createProfile(args);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To accept ownership of a profile using the acceptProfileOwnership function
  const acceptOwnership = async (profileId: string) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.acceptProfileOwnership(profileId);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To add members to a profile using the addMembers function
  const addProfileMembers = async (memberArgs: MemberArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.addMembers(memberArgs);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To remove members from a profile using the removeMembers function
  const removeProfileMembers = async (memberArgs: MemberArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.addMembers(memberArgs);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update profile metadata using the updateProfileMetadata function
  const updateProfileMetadata = async (profileMetadataArgs: ProfileMetadataArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.updateProfileMetadata(profileMetadataArgs);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update profile name using the updateProfileName function
  const updateProfileName = async (profileNameArgs: ProfileNameArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.updateProfileName(profileNameArgs);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update the pending owner of a profile using the updateProfilePendingOwner function
  const updateProfilePendingOwner = async (profileAndAddressArgs: ProfileAndAddressArgs) => {
    if (!registry) {
      throw new Error('Registry is not initialized');
    }

    const txData: TransactionData = registry.updateProfilePendingOwner(profileAndAddressArgs);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  return {
    createProfile,
    acceptOwnership,
    addProfileMembers,
    removeProfileMembers,
    updateProfileMetadata,
    updateProfileName,
    updateProfilePendingOwner
  };
};

export default useWriteRegistry;
