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