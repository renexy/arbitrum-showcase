import { toChecksumAddress } from '@/global/functions';
import { useQuery, gql, ApolloError } from '@apollo/client';

// Query profiles by pagination
const GET_PROFILES_BY_PAGINATION = gql`
  query GetProfilesByPagination($first: Int!, $skip: Int!) {
    profiles(first: $first, skip: $skip) {
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

export function fetchProfilesByPagination(first: number, skip: number): generalProfilesReturn {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_PAGINATION, {
    variables: { first, skip },
    onCompleted: (data) => console.log(/*"Query completed:", data*/),
    onError: (error) => console.error("Query error:", error),
  });

  console.log("fetchProfilesByPagination", data)
  
  return {
    loading,
    error,
    profiles: data,
    refetch,
  };
}

// Query profiles by Profile ID
const GET_PROFILE_BY_ID = gql`
  query GetProfileById($id: ID!) {
    profiles(where: { id: $id }) {
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

export function fetchProfilesById(id: string) {
  const { loading, error, data, refetch } = useQuery(GET_PROFILE_BY_ID, {
    variables: { id },
    onCompleted: (data) => console.log(/*"Query by ID completed:", data*/),
    onError: (error) => console.error("Query by ID error:", error),
  });

  console.log("fetchProfilesById", data)

  return {
    loading,
    error,
    profiles: data,
    refetch,
  };
}


// Query profiles by owner
const GET_PROFILES_BY_OWNER = gql`
  query GetProfilesByOwner($owner: String!) {
    profiles(where: { owner_contains: $owner }) {
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

export function fetchProfilesByOwner(owner: string) {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_OWNER, {
    variables: { owner },
    onCompleted: (data) => console.log(/*"Query by Owner completed:", data*/),
    onError: (error) => console.error("Query by Owner error:", error),
  });

  console.log("fetchProfilesByOwner", data)

  return {
    loading,
    error,
    profiles: data,
    refetch,
  };
}


// Query profiles by name
const GET_PROFILES_BY_NAME = gql`
  query GetProfilesByName($name: String!) {
    profiles(where: { name_contains: $name }) {
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

export function fetchProfilesByName(name: string) {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_NAME, {
    variables: { name },
    onCompleted: (data) => console.log(/*"Query by Name completed:", data*/),
    onError: (error) => console.error("Query by Name error:", error),
  });

  console.log("fetchProfilesByName", data)

  return {
    loading,
    error,
    profiles: data,
    refetch,
  };
}


// Query profiles by anchor
const GET_PROFILES_BY_ANCHOR = gql`
  query GetProfilesByAnchor($anchor: Bytes!) {
    profiles(where: { anchor_contains: $anchor }) {
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

export function fetchProfilesByAnchor(anchor: string) {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_ANCHOR, {
    variables: { anchor },
    onCompleted: (data) => console.log(/*"Query by Anchor completed:", data*/),
    onError: (error) => console.error("Query by Anchor error:", error),
  });

  console.log("fetchProfilesByAnchor", data)

  return {
    loading,
    error,
    profiles: data,
    refetch,
  };
}

export const transformProfileData = (profiles: Profile[]): TransformedProfile[] =>
profiles ? profiles.map(profile => {

  // Transform the profile data
  return {
    anchor: profile.anchor,
    id: profile.id,
    protocol: profile.metadata.protocol === '1' ? "IPFS" : profile.metadata.protocol.toString(),
    pointer: profile.metadata.pointer,
    name: profile.name,
    owner: toChecksumAddress(profile.owner.id) || profile.owner.id,
    members: [],
    pendingOwner: '',
  };
}) : [];