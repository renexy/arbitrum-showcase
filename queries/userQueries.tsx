import { toChecksumAddress } from '@/global/functions';
import { useQuery, gql, ApolloError } from '@apollo/client';

const GET_PROFILES_BY_USER_ADDRESS = gql`
  query GetProfilesByUserAddress($userAddress: ID!) {
    profiles(where: { owner: $userAddress }) {
      id
      name
      owner {
        id
      }
      anchor
      metadata {
        protocol
        pointer
      }
      memberRole {
        accounts {
          id
        }
      }
    }
  }
`;

const GET_USER_ROLES_BY_USER_ADDRESS = gql`
  query getMemberProfilesByUserAddress($userAddress: ID!) {
    roleAccounts(where: { account: $userAddress }) {
      id
      role {
        id
      }
    }
  }
`;

const GET_MEMBER_PROFILES_BY_IDS = gql`
  query GetMemberProfilesByIds($ids: [ID!]!) {
    profiles(where: { id_in: $ids }) {
      id
      name
      owner {
        id
      }
      anchor
      metadata {
        protocol
        pointer
      }
      memberRole {
        accounts {
          id
        }
      }
    }
  }
`;

export const GET_POOL_MANAGERS = gql`
  query getPoolManagers($poolId: ID!) {
    pool (id: $poolId) {
      managerRole {
        id
        accounts{
          id
        }
      }
    }
  }
`;

export const GET_ALLOCATORS = gql`
  query getAllocators($strategy: Bytes!) {
    allocators(where: {strategy: $strategy}) {
      address
      flag
    }
  }
`;


// Fetches owned profiles given user address
export function fetchOwnedProfiles(userAddress: string): ownedProfilesReturn {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_USER_ADDRESS, {
    variables: { userAddress },
    onCompleted: (data: any) => console.log(/*"Owned Profiles Query completed:", data*/),
    onError: (error: ApolloError) => console.error(/*"Owned Profiles Query error:", error*/),
  });

  // Determine if profiles are available
  const hasProfiles = data?.profiles && data.profiles.length > 0;

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
    hasProfiles, // Indicates if profiles are available
    refetch,
  };
}

// Fetches role Ids given address has
export function fetchRoleIds(userAddress: string): RoleIdsResponse {
  const { loading, error, data, refetch } = useQuery(GET_USER_ROLES_BY_USER_ADDRESS, {
    variables: { userAddress },
    onCompleted: (data: any) => console.log(/*"Role IDs Query completed:", data*/),
    onError: (error: ApolloError) => console.error(/*"Role IDs Query error:", error*/),
  });

  // Determine if profiles are available
  const hasMemberProfiles = data?.profiles && data.profiles.length > 0;

  //console.log("ROLE IDS", data)

  return {
    loading,
    error,
    roleAccounts: data,
    hasMemberProfiles, // Indicates if member profiles are available
    refetch,
  };
}

// Fetches member profiles given role Ids
export function fetchMemberProfiles(userAddress: string): memberProfilesReturn {
  const roleIdsReponse = fetchRoleIds(userAddress)

  //console.log("roleIdsReponse", roleIdsReponse)

  // Transform roleAccounts data to extract IDs
  const extractIdsFromRoleAccounts = (response: RoleIdsResponse) => {
    return response && response.roleAccounts
      ? response.roleAccounts.roleAccounts.map(account => account.role.id)
      : [];
  };

  // Extract IDs directly from roleIdsReponse
  const ids = extractIdsFromRoleAccounts(roleIdsReponse);

  //console.log("roleAccountIds", roleAccountIds)

  const { loading, error, data, refetch } = useQuery(GET_MEMBER_PROFILES_BY_IDS, {
    variables: { ids },
    onCompleted: (data: any) => console.log(/*"Member Profiles Query completed:", data*/),
    onError: (error: ApolloError) => console.error(/*"Member Profiles Query error:", error*/),
  });

  // Determine if profiles are available
  const hasMemberProfiles = data?.profiles && data.profiles.length > 0;

  return {
    loading,
    error,
    memberProfiles: data ? transformProfileData(data.profiles) : [],
    hasMemberProfiles, // Indicates if profiles are available
    refetch,
  };
}

export const transformProfileData = (profiles: Profile[]): TransformedProfile[] =>
profiles ? profiles.map(profile => {
  // Transform each member in the memberRole.accounts array
  const transformedMembers = profile.memberRole.accounts.map((account: RawAccount) => {
    const [id, rawAddress] = account.id.split("-");
    const address = toChecksumAddress(rawAddress) || rawAddress;
    return { id, address };
  });

  // Transform the profile data
  return {
    anchor: profile.anchor,
    id: profile.id,
    protocol: profile.metadata.protocol === '1' ? "IPFS" : profile.metadata.protocol.toString(),
    pointer: profile.metadata.pointer,
    name: profile.name,
    owner: toChecksumAddress(profile.owner.id) || profile.owner.id,
    members: transformedMembers,
    pendingOwner: '',
  };
}) : [];

// Fetches selected pool managers
export function fetchPoolManagers(poolId: string): profileMembersReturn {
  const { loading, error, data, refetch } = useQuery(GET_POOL_MANAGERS, {
    variables: { poolId },
    onCompleted: (data: any) => console.log(/*"Owned Profiles Query completed:", data*/),
    onError: (error: ApolloError) => console.error(/*"Owned Profiles Query error:", error*/),
  });

  // Extract addresses from the data
  const addresses = extractAddresses(data)

  return {
    loading,
    error,
    poolManagers: addresses,
    hasManagers: addresses.length > 0,
    refetch,
  };
}

// Fetches selected pool allocators
export function fetchPoolAllocators(strategy: string): profileAllocatorsReturn {
  const { loading, error, data, refetch } = useQuery<AllocatorsResponse>(GET_ALLOCATORS, {
    variables: { strategy },
    onCompleted: (data) => console.log("Query completed:", data),
    onError: (error) => console.error("Query error:", error),
  });

  // Process the data with the helper function
  const activeAllocatorAddresses = data ? extractActiveAllocators(data) : [];

  return {
    loading,
    error,
    poolAllocators: activeAllocatorAddresses,
    hasAllocators: activeAllocatorAddresses.length > 0,
    refetch,
  };
}

// Helper function to extract allocator addresses with true flag
export function extractActiveAllocators(data: AllocatorsResponse): string[] {
  const activeAllocators: string[] = [];

  data.allocators.forEach(allocator => {
    if (allocator.flag) {
      activeAllocators.push(allocator.address);
    }
  });

  return activeAllocators;
}


export const extractAddresses = (data: any): string[] => {
  return data?.pool?.managerRole?.accounts?.map((account: any) => {
    const idParts = account.id.split("-");
    return idParts.length > 1 ? idParts[1] : null;
  }).filter((address: string | null) => address !== null) || [];
}