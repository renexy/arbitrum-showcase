import { ReactNode, createContext, useEffect, useState } from 'react';
import { Allo, MicroGrantsStrategy, Registry } from '@allo-team/allo-v2-sdk';
import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { useNetwork } from "wagmi";
import { ethers } from 'ethers';
import { fetchOwnedProfiles, fetchMemberProfiles, transformProfileData, fetchPoolManagers, extractAddresses } from '@/queries/userQueries';
import { TPoolData, TPoolMetadata } from "@/types/typesPool";
import { getIPFSClient } from "@/services/ipfs";
import { getActiveMicroGrantsQuery, getEndedMicroGrantsQuery, getUpcomingMicroGrantsQuery, graphqlEndpoint } from "@/queries/poolQuery";

enum TPoolType {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
}

// Initial state definitions
interface GlobalContextState {
  registry: Registry | undefined;
  allo: Allo | undefined;
  microStrategy: MicroGrantsStrategy | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  signer: ethers.providers.JsonRpcSigner | undefined;
  userProfiles: TransformedProfile[];
  nonce: number;
  hasProfiles: boolean;
  refetchProfiles: () => void;
  refetchPools: () => void;
  selectedProfileHash: string | undefined;
  changeSelectedProfileHash: (hash: string) => void;
  userMemberProfiles: TransformedProfile[];
  upcomingPools?: TPoolData[];
  activePools?: TPoolData[];
  endedPools?: TPoolData[];
  loading?: boolean;
  activeProfilePools?: TPoolData[];
  endedProfilePools?: TPoolData[];
  isPoolAdmin: boolean;
  selectedPool: TPoolData | undefined;
  changeSelectedPool: (pool: TPoolData | undefined) => void;
  poolManagersList: string[];
  hasPoolManagers: boolean;
}

const GlobalContext = createContext<GlobalContextState>({
  registry: undefined,
  allo: undefined,
  microStrategy: undefined,
  provider: undefined,
  signer: undefined,
  userProfiles: [],
  nonce: 0,
  hasProfiles: false,
  refetchProfiles: () => { },
  refetchPools: () => { },
  selectedProfileHash: '',
  changeSelectedProfileHash: (hash) => { },
  userMemberProfiles: [],
  upcomingPools: [],
  activePools: [],
  endedPools: [],
  loading: true,
  activeProfilePools: [],
  endedProfilePools: [],
  isPoolAdmin: false,
  selectedPool: undefined,
  changeSelectedPool: (pool: TPoolData | undefined) => { },
  poolManagersList: [],
  hasPoolManagers: false,
});

interface GlobalProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

export const GlobalContextProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const chainId = chain?.id;

  const [registry, setRegistry] = useState<Registry | undefined>();
  const [allo, setAllo] = useState<Allo | undefined>();
  const [microStrategy, setMicroStrategy] = useState<MicroGrantsStrategy | undefined>();

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();

  const [userProfiles, setUserProfiles] = useState<TransformedProfile[]>([])
  const [userMemberProfiles, setUserMemberProfiles] = useState<TransformedProfile[]>([])
  const [selectedProfileHash, setSelectedProfileHash] = useState<string>()
  const [nonce, setNonce] = useState<number>(0)

  const [upcomingPools, setUpcomingPools] = useState<TPoolData[] | undefined>([]);
  const [activePools, setActivePools] = useState<TPoolData[] | undefined>([]);
  const [endedPools, setEndedPools] = useState<TPoolData[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true)

  const [activeProfilePools, setActiveProfilePools] = useState<TPoolData[] | undefined>([]);
  const [endedProfilePools, setEndedProfilePools] = useState<TPoolData[] | undefined>([]);
  const [isPoolAdmin, setIsPoolAdmin] = useState<boolean>(false);

  const [selectedPool, setSelectedPool] = useState<TPoolData | undefined>(undefined)

  const [poolManagersList, setPoolManagersList] = useState<string[]>([]);
  const [hasPoolManagers, setHasPoolManagers] = useState<boolean>(false)

  // Graphql
  const { loading: loadingOwnedProfiles, error, profiles, hasProfiles, refetch: refetchOwned } = fetchOwnedProfiles(address || '');
  const { memberProfiles, hasMemberProfiles, refetch: refetchMember } = fetchMemberProfiles(address || '');
  const { poolManagers, hasManagers, refetch: refetchPoolManagers } = fetchPoolManagers(selectedPool?.poolId || '');

  const changeSelectedProfileHash = (hash: string) => {
    setSelectedProfileHash(hash)
  }

  const changeSelectedPool = (pool: TPoolData | undefined) => {
    setSelectedPool(pool)
  }

  const refetchProfiles = async () => {
    const { data: refetchedProfilesData } = await refetchOwned();
    const { data: refetchedMemberProfilesData } = await refetchMember();

    //console.log("refetchedProfilesData", refetchedProfilesData)
    //console.log("refetchedMemberProfilesData", refetchedMemberProfilesData)
  
    // Apply the transformations to the refetched data
    const transformedRefetchedProfiles = transformProfileData(refetchedProfilesData.profiles);
    const transformedRefetchedMemberProfiles = transformProfileData(refetchedMemberProfilesData.profiles);

    await getPendingOwner(registry, transformedRefetchedProfiles, transformedRefetchedMemberProfiles);
  };

  const refetchPools = async () => {
    fetchData();
  }

  const getPendingOwner = async (registry: any, profiles: TransformedProfile[], memberProfiles: TransformedProfile[]) => {
    const rpc = 'https://rpc.goerli.eth.gateway.fm';
    const customProvider = new ethers.providers.JsonRpcProvider(rpc);
    const contractAddress = registry.contract.address;
    const contractAbi = registry.contract.abi;
    const readOnlyContract = new ethers.Contract(contractAddress, contractAbi, customProvider);

    //console.log("profiles OBJ", profiles)
    //console.log("memberProfiles OBJ", memberProfiles)

    try {
      const updatedProfiles = await Promise.all(profiles.map(async profile => {
        const pendingOwner = await readOnlyContract.profileIdToPendingOwner(profile.id);
        return { ...profile, pendingOwner };
      }));

      //console.log("updatedProfiles", updatedProfiles)

      //console.log("userProfiles", userProfiles)
      //console.log("updatedProfiles", updatedProfiles)

      setUserProfiles(updatedProfiles);

      const updatedMemberProfiles = await Promise.all(memberProfiles.map(async profile => {
        const pendingOwner = await readOnlyContract.profileIdToPendingOwner(profile.id);
        return { ...profile, pendingOwner };
      }));

      //console.log("userMemberProfiles", userMemberProfiles)
      //console.log("updatedMemberProfiles", updatedMemberProfiles)

      //console.log("updatedMemberProfiles", updatedMemberProfiles)

      const newMemberProfiles = updatedMemberProfiles.filter(memberProfile =>
        !updatedProfiles.some(profile => profile.id === memberProfile.id)
      );

      //console.log("newMemberProfiles", newMemberProfiles)

      // here we take only the profiles that don't appear in userProfiles, since
      // we don't want to show duplicates
      setUserMemberProfiles(newMemberProfiles);
      //console.log("updatedMemberProfiles", updatedMemberProfiles)

    } catch (error) {
      console.error('Error in getPendingOwner:', error);
    }
  };

  const getIsPoolAdmin = async (allo: any, poolId: string, address: string) => {
    const rpc = 'https://rpc.goerli.eth.gateway.fm';
    const customProvider = new ethers.providers.JsonRpcProvider(rpc);
    const contractAddress = allo.contract.address;
    const contractAbi = allo.contract.abi;
    console.log("contractAddress", contractAddress)
    const readOnlyContract = new ethers.Contract(contractAddress, contractAbi, customProvider);

    const isPoolAdmin = await readOnlyContract.isPoolAdmin(poolId, address);
    return isPoolAdmin;
  }

  const ipfsClient = getIPFSClient();

  const fetchPools = async (queryType: string, first: number, offest: number) => {
    const response = await fetch('/api/pools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryJson: queryType,
        first: first,
        offset: offest,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  };

  const getPools = async (type: TPoolType) => {
    let pools: TPoolData[] = [];

    let graphqlQuery;
    let responseObject;

    if (type === TPoolType.UPCOMING) {
      graphqlQuery = getUpcomingMicroGrantsQuery;
      responseObject = "upcomingMicroGrants";
    } else if (type === TPoolType.ACTIVE) {
      graphqlQuery = getActiveMicroGrantsQuery;
      responseObject = "activeMicroGrants";
    } else if (type === TPoolType.ENDED) {
      graphqlQuery = getEndedMicroGrantsQuery;
      responseObject = "endedMicroGrants";
    } else {
      return pools;
    }

    console.log(graphqlQuery)

    try {
      const response = await fetchPools(graphqlQuery, 25, 0);
    
      if (type === TPoolType.UPCOMING) {
        pools = response.upcomingMicroGrants;
        console.log("upcomingMicroGrants", pools);
      } else if (type === TPoolType.ACTIVE) {
        pools = response.activeMicroGrants;
        console.log("activeMicroGrants", pools);
      } else if (type === TPoolType.ENDED) {
        pools = response.endedMicroGrants;
        console.log("endedMicroGrants", pools);
      }
    
      console.log("POOLS", pools);
    
      if (!pools) {
        console.log("Pools length is zero");
        return;
      }
    
      for (const pool of pools) {
        let metadata: TPoolMetadata;
        try {
          const pointer = pool.pool.metadataPointer.toString();
          metadata = await ipfsClient.fetchJson(pointer);
          pool.pool.metadata = metadata;
          if (metadata.base64Image) {
            let poolBanner = await ipfsClient.fetchJson(metadata.base64Image);
            pool.pool.poolBanner = poolBanner.data;
          }
          if (!metadata.name) {
            metadata.name = `Pool ${pool.poolId}`;
          }
        } catch (error) {
          console.log("IPFS", "Unable to fetch metadata", error);
        }
      }
    } catch (error) {
      console.log("Error fetching pools: ", error);
    }    

    //console.log("SALGMAOSLGMAD", pools)
    return pools;
  }

  const fetchData = async () => {
    // const upcomingPools = await getPools(TPoolType.UPCOMING);
    const activePools = await getPools(TPoolType.ACTIVE);
    const endedPools = await getPools(TPoolType.ENDED);

    // Filter based on connected chain.Id
    const filteredActivePools = activePools?.filter(pool => pool.chainId === chain?.id.toString());
    const filteredEndedPools = endedPools?.filter(pool => pool.chainId === chain?.id.toString());

    // setUpcomingPools(upcomingPools);
    setActivePools(filteredActivePools);
    setEndedPools(filteredEndedPools);
    setLoading(false)

    //console.log("upcomingPools", upcomingPools)
    //console.log("activePools", activePools)
    //console.log("endedPools", endedPools)
  };

  // Now we filter both active/ended pools based on selectedProfileHash
  useEffect(() => {
    // Function to filter pools based on the selected profile
    const filterPools = (pools: TPoolData[] | undefined) => pools?.filter(pool => pool.pool.profile.profileId === selectedProfileHash);
  
    console.log("filterPools(endedPools)", endedPools)
    // Update state for active and inactive pools based on the selected profile
    setActiveProfilePools(filterPools(activePools));
    setEndedProfilePools(filterPools(endedPools));
    //console.log("filterPools(activePools)", filterPools(activePools))
    //console.log("filterPools(endedPools)", filterPools(endedPools))

    const fetchPoolAdminStatus = async () => {
      if (!selectedPool) {
        console.log("SelectedPool is undefined")
        return;
      }

      if (address) {
        const isPoolAdmin = await getIsPoolAdmin(allo, selectedPool?.poolId, address);
        console.log("isPoolAdmin", isPoolAdmin)
        setIsPoolAdmin(isPoolAdmin);
      }
    };

    fetchPoolAdminStatus();
  }, [selectedProfileHash, activePools, endedPools]); // Re-run when the selected profile or pools list changes

  const refetchManagers = async () => {
    try {
      // Refetching data and handling the result
      const { data } = await refetchPoolManagers({ poolId: selectedPool?.poolId || '' });
      const addresses = extractAddresses(data);
  
      //console.log("refetchedMemberProfilesData", data);
      //console.log("transformedPoolManagers", addresses);
  
      setPoolManagersList(addresses);
      setHasPoolManagers(addresses.length > 0);
    } catch (error) {
      console.error("Error during refetching:", error);
    }
  }
  
  useEffect(() => {
    refetchManagers();
  }, [selectedPool]);

  useEffect(() => {

    if (chainId) {
      setRegistry(new Registry({ chain: chainId, rpc: window.ethereum }));
      setAllo(new Allo({ chain: chainId, rpc: window.ethereum }));
      setMicroStrategy(new MicroGrantsStrategy({ chain: chainId, rpc: window.ethereum }));
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);
    } else {
      console.log("Ethereum object doesn't exist on window. You should consider installing MetaMask!");
    }

    if (!profiles) {
      console.log("No profiles found")
      return;
    }

    if (!memberProfiles) {
      console.log("No member profiles found")
      return;
    }

    if (profiles.length === 0) {
      setNonce(profiles.length)
    } else {
      setNonce(profiles.length + 1)
    }

    if (isConnected) {
      if (registry) {
        getPendingOwner(registry, profiles, memberProfiles);
      }
    }

    fetchData();
  }, [chainId, chain, address, isConnected, hasProfiles, hasMemberProfiles]);

  return (
    <GlobalContext.Provider value={{
      registry, allo, microStrategy, provider, signer, userProfiles, hasProfiles,
      nonce, refetchProfiles, selectedProfileHash, changeSelectedProfileHash, userMemberProfiles,
      upcomingPools, activePools, endedPools, loading,
      activeProfilePools, endedProfilePools,
      isPoolAdmin,
      selectedPool, changeSelectedPool, refetchPools,
      poolManagersList, hasPoolManagers
    }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContext;