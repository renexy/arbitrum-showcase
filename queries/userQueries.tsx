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

export function useUserProfiles(userAddress: string): UseUserProfilesReturn {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_USER_ADDRESS, {
    variables: { userAddress },
    onCompleted: (data: any) => console.log("Query completed:", data),
    onError: (error: any) => console.error("Query error:", error),
  });

  const transformProfileData = (profiles: Profile[]): TransformedProfile[] =>
    profiles ? profiles.map(profile => {
      // Transform each member in the memberRole.accounts array
      const transformedMembers = profile.memberRole.accounts.map((account: RawAccount) => {
        const [id, address] = account.id.split("-");
        return { id, address };
      });

      // Transform the profile data
      return {
        anchor: profile.anchor,
        id: profile.id,
        protocol: profile.metadata.protocol === '1' ? "IPFS" : profile.metadata.protocol.toString(),
        pointer: profile.metadata.pointer,
        name: profile.name,
        owner: profile.owner.id,
        members: transformedMembers,
        pendingOwner: '',
      };
    }) : [];

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
