import { useContext } from "react";
import GlobalContext from "../context/ContextAggregator";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

// Custom hook for retrieving registry and signer from context
const useRegistry = () => {
  return useContext(GlobalContext);
};

// Custom hook to create profile
const useCreateProfile = () => {
  const { registry, signer } = useRegistry();

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

  const acceptOwnership = async (args: CreateProfileArgs) => {
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

  return { createProfile, acceptOwnership };
};

export default useCreateProfile;
