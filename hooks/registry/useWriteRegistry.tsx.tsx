import GlobalContext from "../context/ContextAggregator";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import React from "react";

// Write Functions of Registry.sol

// To retrieve the Allo Owner
export const createProfileTest = async (args: CreateProfileArgs) => {
  const { registry, signer } = React.useContext(GlobalContext)
  if (!registry) {
      throw new Error('Registry is not initialized');
  }

  const txData: TransactionData = registry.createProfile(args);

  const hash = await signer?.sendTransaction({
    data: txData.data,
    value: BigInt(txData.value),
  });

  return hash;
}