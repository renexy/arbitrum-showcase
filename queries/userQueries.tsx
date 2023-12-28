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
        id
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

  return {
    loading,
    error,
    profiles: data?.profiles,
  };
}