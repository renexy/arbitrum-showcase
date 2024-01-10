type Metadata = {
  protocol: string;
  pointer: string;
};

interface MemberRole {
  accounts: RawAccount[];
}

interface RawAccount {
  id: string;
}

interface Account {
  id: string;
  address: string;
}

type Owner = {
  id: string;
};

type Profile = {
  id: string;
  name: string;
  owner: {
    id: string;
  };
  anchor: string;
  metadata: Metadata;
  memberRole: MemberRole;
};

type TransformedProfile = {
  anchor: string;
  id: string;
  protocol: string;
  pointer: string;
  name: string;
  owner: string;
  members: Account[];
  pendingOwner: string;
};

type ownedProfilesReturn = {
  loading: boolean;
  error?: ApolloError;
  profiles?: TransformedProfile[];
  hasProfiles: boolean;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
};

type memberProfilesReturn = {
  loading: boolean;
  error?: ApolloError;
  memberProfiles?: TransformedProfile[];
  hasMemberProfiles: boolean;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
};

type generalProfilesReturn = {
  loading: boolean;
  error?: ApolloError;
  profiles?: TransformedProfile[];
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
};

interface Role {
  id: string;
  __typename: string;
}

interface RoleAccount {
  id: string;
  role: Role;
  __typename: string;
}

interface RoleAccountsDouble {
  roleAccounts: RoleAccount[];
}

interface RoleIdsResponse {
  loading: boolean;
  error: ApolloError;
  roleAccounts: RoleAccountsDouble;
  hasMemberProfiles?: boolean;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}

type profileMembersReturn = {
  loading: boolean;
  error?: ApolloError;
  poolManagers: string[];
  hasManagers: boolean;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
};

type TokenMetadata = {
  name: string | null;
  symbol: string | null;
  decimals: number | null;
};

type PoolData = {
  strategy: string;
  strategyName: string;
  tokenMetadata: TokenMetadata;
  token: string;
  amount: string;
  metadataPointer: string;
  profile: {
      name: string;
      profileId: string;
  };
  metadata: {
      base64Image: string;
      description: string;
      name: string;
      profileId: string;
      website: string;
  };
};

type MicroGrantRecipient = {
  blockTimestamp: string;
  isUsingRegistryAnchor: boolean;
  metadataPointer: string;
  metadata: any;
  recipientAddress: string;
  recipientId: string;
  requestedAmount: string;
  status: string;
};

type ApplicationData = {
  poolId: string;
  chainId: string;
  strategy: string;
  allocationStartTime: number;
  allocationEndTime: number;
  approvalThreshold: number;
  blockTimestamp: string;
  maxRequestedAmount: string;
  distributeds: Array<any>;  // Adjust this according to the actual structure of 'distributeds'
  microGrantRecipients: MicroGrantRecipient[];
  pool: PoolData;
  useRegistryAnchor: boolean;
};

type TotalApplications = ApplicationData[];

interface Profile {
  anchor: string;
  id: string;
  metadata: {
    pointer: string;
    protocol: number;
    __typename: string;
  };
  name: string;
  owner: {
    id: string;
  };
}

type ProfilesArray = Profile[];

type ArrayProfilesArray = ProfilesArray[]
