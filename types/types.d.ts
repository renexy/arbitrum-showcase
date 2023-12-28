type Metadata = {
    id: string;
  };
  
  type Owner = {
    id: string;
  };
  
  type Profile = {
    id: string;
    name: string;
    owner: Owner;
    anchor: string;
    metadata: Metadata;
  };
  
  type UseUserProfilesReturn = {
    loading: boolean;
    error?: ApolloError;
    profiles?: Profile[];
  };