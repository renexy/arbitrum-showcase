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

type UseUserProfilesReturn = {
  loading: boolean;
  error?: ApolloError;
  profiles?: TransformedProfile[];
  hasProfiles: boolean;
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
};