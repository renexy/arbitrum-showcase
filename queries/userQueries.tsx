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
    }
  }
`;

export function useUserProfiles(userAddress: string): UseUserProfilesReturn {
  const { loading, error, data } = useQuery(GET_PROFILES_BY_USER_ADDRESS, {
    variables: { userAddress },
    onCompleted: (data) => console.log("Query completed:", data),
    onError: (error) => console.error("Query error:", error),
  });

  const transformProfileData = (profiles: any[]): TransformedProfile[] => 
    profiles.map(profile => ({
      anchor: profile.anchor,
      id: profile.id,
      protocol: profile.metadata.protocol === "1" ? "IPFS" : profile.metadata.protocol,
      pointer: profile.metadata.pointer,
      name: profile.name,
      owner: profile.owner.id,
    })
  );

  console.log("Profiles:", transformProfileData(data?.profiles))

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : undefined,
  };
}