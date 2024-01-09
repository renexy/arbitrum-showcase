import { useQuery, gql, ApolloError } from '@apollo/client';
import { transformProfileData } from './userQueries';

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
      memberRole {
        accounts {
          id
        }
      }
    }
  }
`;

export function fetchOwnedProfiles(first: number, skip: number): generalProfilesReturn {
  const { loading, error, data, refetch } = useQuery(GET_PROFILES_BY_PAGINATION, {
    variables: { first, skip },
    onCompleted: (data) => console.log(/*"Query completed:", data*/),
    onError: (error) => console.error("Query error:", error),
  });
  
  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
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

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
    refetch,
  };
}


// Query profiles by owner
const GET_PROFILES_BY_OWNER = gql`
  query GetProfilesByOwner($owner: String!) {
    profiles(where: { owner: $owner }) {
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

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
    refetch,
  };
}


// Query profiles by name
const GET_PROFILES_BY_NAME = gql`
  query GetProfilesByName($name: String!) {
    profiles(where: { name: $name }) {
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

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
    refetch,
  };
}


// Query profiles by anchor
const GET_PROFILES_BY_ANCHOR = gql`
  query GetProfilesByAnchor($anchor: Bytes!) {
    profiles(where: { anchor: $anchor }) {
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

  return {
    loading,
    error,
    profiles: data ? transformProfileData(data.profiles) : [],
    refetch,
  };
}
