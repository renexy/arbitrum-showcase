import { ReactNode, createContext, useEffect, useState } from 'react';
import { Allo, MicroGrantsStrategy, Registry } from '@allo-team/allo-v2-sdk';
import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { useNetwork } from "wagmi";
import { ethers } from 'ethers';
import { fetchOwnedProfiles, fetchMemberProfiles, transformProfileData } from '@/queries/userQueries';

// Initial state definitions
interface GlobalContextState {
  registry: Registry | undefined;
  allo: Allo | undefined;
  microStrategy: MicroGrantsStrategy | undefined;
  provider: ethers.providers.JsonRpcProvider | undefined;
  signer: ethers.providers.JsonRpcSigner | undefined;
  userProfiles: TransformedProfile[];
  nonce: number;
  hasProfiles: boolean;
  refetchProfiles: () => void;
  selectedProfileHash: string | undefined;
  changeSelectedProfileHash: (hash: string) => void;
  userMemberProfiles: TransformedProfile[];
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
  selectedProfileHash: '',
  changeSelectedProfileHash: (hash) => { },
  userMemberProfiles: []
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

  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | undefined>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();

  const [userProfiles, setUserProfiles] = useState<TransformedProfile[]>([])
  const [userMemberProfiles, setUserMemberProfiles] = useState<TransformedProfile[]>([])
  const [selectedProfileHash, setSelectedProfileHash] = useState<string>()
  const [nonce, setNonce] = useState<number>(0)
  const { loading, error, profiles, hasProfiles, refetch: refetchOwned } = fetchOwnedProfiles(address || '');
  const { memberProfiles, hasMemberProfiles, refetch: refetchMember } = fetchMemberProfiles(address || '');

  const changeSelectedProfileHash = (hash: string) => {
    setSelectedProfileHash(hash)
  }

  const refetchProfiles = async () => {
    const { data: refetchedProfilesData } = await refetchOwned();
    const { data: refetchedMemberProfilesData } = await refetchMember();

    console.log("refetchedProfilesData", refetchedProfilesData)
    console.log("refetchedMemberProfilesData", refetchedMemberProfilesData)
  
    // Apply the transformations to the refetched data
    const transformedRefetchedProfiles = transformProfileData(refetchedProfilesData.profiles);
    const transformedRefetchedMemberProfiles = transformProfileData(refetchedMemberProfilesData.profiles);
  
    await getPendingOwner(registry, transformedRefetchedProfiles, transformedRefetchedMemberProfiles);
  };

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
        !updatedProfiles.some(profile => profile.anchor === memberProfile.anchor)
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

  useEffect(() => {
    if (chainId) {
      setRegistry(new Registry({ chain: chainId, rpc: window.ethereum }));
      console.log("CHAINID", chainId)
      setAllo(new Allo({ chain: chainId, rpc: window.ethereum }));
      setMicroStrategy(new MicroGrantsStrategy({ chain: chainId, rpc: window.ethereum }));
    }

    if (window.ethereum) {
      const provider = new ethers.providers.JsonRpcProvider(window.ethereum);
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
  }, [chainId, chain, address, isConnected, hasProfiles, hasMemberProfiles]);

  return (
    <GlobalContext.Provider value={{
      registry, allo, microStrategy, provider, signer, userProfiles, hasProfiles,
      nonce, refetchProfiles, selectedProfileHash, changeSelectedProfileHash, userMemberProfiles
    }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContext;