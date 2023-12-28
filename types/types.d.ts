type Metadata = {
  protocol: string;
  pointer: string;
};

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
};

type TransformedProfile = {
  anchor: string;
  id: string;
  protocol: string;
  pointer: string;
  name: string;
  owner: string;
};

type UseUserProfilesReturn = {
  loading: boolean;
  error?: ApolloError;
  profiles?: TransformedProfile[];
};