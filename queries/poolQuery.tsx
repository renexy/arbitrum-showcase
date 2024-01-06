import { toChecksumAddress } from '@/global/functions';
import { useQuery, gql, ApolloError } from '@apollo/client';
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

enum TPoolType {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
}

export type TPoolMetadata = {
  profileId: `0x${string}`;
  name: string;
  website: string;
  description: string;
  base64Image?: string;
};

export type TAllocatedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  blockTimestamp: string;
  status: string;
  transactionHash: string;
};

export type TDistributedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  amount: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type TMicroGrantRecipient = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  requestedAmount: string;
  metadataPointer: string;
  blockTimestamp: string;
  isUsingRegistryAnchor: boolean;
  status: ApplicationStatus;
  metadata?: any;
  applicationBanner?: string;
};

export type TStrategyType = keyof typeof StrategyType;

type ApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Paid";

export type TPoolData = {
  poolId: string;
  chainId: string;
  strategy: string;
  allocationStartTime: number;
  allocationEndTime: number;
  approvalThreshold: number;
  maxRequestedAmount: string;
  blockTimestamp: string;
  useRegistryAnchor: boolean;
  pool: {
    strategy: string;
    strategyName: string;
    tokenMetadata: {
      name?: string;
      symbol?: string;
      decimals?: number;
    };
    token: `0x${string}`;
    amount: string;
    metadataPointer: string;
    poolBanner: string;
    metadata: TPoolMetadata;
    profile: {
      profileId: `0x${string}`;
      name: string;
    };
  };
  allocateds: TAllocatedData[];
  distributeds: TDistributedData[];
  microGrantRecipients: TMicroGrantRecipient[];
  strategyType: TStrategyType;
  // Hat
  hatId?: number;
  // Gov
  gov?: string;
  minVotePower?: string;
  snapshotReference?: string;
};

const microGrantsQuery = `
  {
    poolId
    chainId
    strategy
    allocationStartTime
    allocationEndTime
    approvalThreshold
    maxRequestedAmount
    blockTimestamp
    pool {
      strategy
      strategyName
      tokenMetadata
      token
      amount
      metadataPointer
      profile {
        profileId
        name
      }
    }
  }
`;

export const getActiveMicroGrantsQuery = gql`
  query getActiveMicroGrantsQuery($first: Int!, $offset: Int!) {
    activeMicroGrants(
      orderBy: BLOCK_TIMESTAMP_DESC,
      first: $first,
      offset: $offset
    )
      ${microGrantsQuery}
  }
`;

export function usePools(type: TPoolType) {
  let allPools = [];
  let offset = 0;
  let loadingComplete = false;

  const { loading, error, data, fetchMore } = useQuery(getPoolsQuery, {
    variables: { first: 100, offset, type },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.pools.length > 0) {
        allPools = allPools.concat(data.pools);
        offset += data.pools.length;
        if (data.pools.length < 100) {
          loadingComplete = true;
        } else {
          fetchMore({ variables: { first: 100, offset, type } });
        }
      } else {
        loadingComplete = true;
      }
    },
    onError: (error: ApolloError) => console.error("Pool Query error:", error),
  });

  return {
    loading,
    error,
    pools: allPools,
    loadingComplete, // Indicates if all pools have been loaded
    fetchMore,
  };
}

/*const GET_ALL_POOLS = gql`
  query GetAllPools($after: ID) {
    pools(first: 100, after: $after) {
      id
      token
      strategy
    }
  }
`;

// Fetch All Pools
export function fetchAllPools() {
  let allPools = [];
  let lastPoolID = null;
  let loadingComplete = false;

  const { loading, error, data, fetchMore } = useQuery(GET_ALL_POOLS, {
    variables: { after: lastPoolID },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.pools.length > 0) {
        allPools = allPools.concat(data.pools);
        lastPoolID = data.pools[data.pools.length - 1].id;
        if (data.pools.length < 100) {
          loadingComplete = true;
        } else {
          fetchMore({ variables: { after: lastPoolID } });
        }
      } else {
        loadingComplete = true;
      }
    },
    onError: (error: ApolloError) => console.error("Pool Query error:", error),
  });

  return {
    loading,
    error,
    pools: allPools,
    loadingComplete, // Indicates if all pools have been loaded
    fetchMore,
  };
}*/
