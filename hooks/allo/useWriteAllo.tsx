import { useContext } from "react";
import GlobalContext from "../context/ContextAggregator";
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { UpdateMetaDataArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";

// Custom hook for retrieving allo, provider and signer from context
const useRegistry = () => {
  return useContext(GlobalContext);
};

// Custom hook to retrieve allo write functions
const useWriteAllo = () => {
  const { allo, signer } = useRegistry();

  // To create a new pool with a custom strategy
  const createPoolWithCustomStrategy = async (args: CreatePoolArgs) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.createPoolWithCustomStrategy(args);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To create a new pool
  const createPool = async (args: CreatePoolArgs) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.createPool(args);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update pool metadata
  const updatePoolMetadata = async (args: UpdateMetaDataArgs) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.updatePoolMetadata(args);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update the Registry address
  const updateRegistryAddress = async (registryAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.updateRegistry(registryAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update the Treasury address
  const updateTreasuryAddress = async (treasuryAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.updateTreasury(treasuryAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update the Percent Fee:
  const updatePercentFee = async (newPercentFee: number) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.updatePercentFee(newPercentFee);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To update the Base Fee
  const updateBaseFee = async (newBaseFee: number) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.updateBaseFee(newBaseFee);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To add a strategy to the list of cloneable strategies
  const addCloneableStrategies = async (strategyAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.addToCloneableStrategies(strategyAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To remove a strategy from the list of cloneable strategies
  const removeCloneableStrategies = async (strategyAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.removeFromCloneableStrategies(strategyAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To add a manager to a pool
  const addPoolManager = async (poolId: number, managerAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.addPoolManager(poolId, managerAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To remove a manager to a pool
  const removePoolManager = async (poolId: number, managerAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.removePoolManager(poolId, managerAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To recover funds
  const recoverFunds = async (tokenAddress: string, recipientAddress: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.recoverFunds(tokenAddress, recipientAddress);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To register a recipient for a specific pool
  const registerPoolRecipient = async (poolId: number, strategyData: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.registerRecipient(poolId, strategyData);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To batch register recipients for multiple pools
  const batchRegisterPoolRecipient = async (poolId: number[], strategyData: string[]) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.batchRegisterRecipient(poolId, strategyData);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To fund a pool with a specific amount
  const fundPool = async (poolId: number, amount: number) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.fundPool(poolId, amount);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To allocate funds for a specific pool
  const allocate = async (poolId: number, strategyData: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.allocate(poolId, strategyData);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To batch allocate funds to multiple pools
  const batchAllocate = async (poolId: number[], strategyData: string[]) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.batchAllocate(poolId, strategyData);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  // To distribute funds to multiple recipients in a pool
  const distribute = async (poolId: number, recipientIds: string[], strategyData: string) => {
    if (!allo) {
      throw new Error('Allo is not initialized');
    }

    const txData: TransactionData = allo.distribute(poolId, recipientIds, strategyData);

    const hash = await signer?.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: BigInt(txData.value),
    });

    return hash;
  };

  return {
    createPoolWithCustomStrategy,
    createPool,
    updatePoolMetadata,
    updateRegistryAddress,
    updateTreasuryAddress,
    updatePercentFee,
    updateBaseFee,
    addCloneableStrategies,
    removeCloneableStrategies,
    addPoolManager,
    removePoolManager,
    recoverFunds,
    registerPoolRecipient,
    batchRegisterPoolRecipient,
    fundPool,
    allocate,
    batchAllocate,
    distribute
  };
};

export default useWriteAllo;