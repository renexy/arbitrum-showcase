import { ReactNode, createContext, useEffect, useState } from 'react';
import { Allo, MicroGrantsStrategy, Registry } from '@allo-team/allo-v2-sdk';
import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { useNetwork } from "wagmi";
import { ethers } from 'ethers';
import { fetchOwnedProfiles, fetchMemberProfiles } from '@/queries/userQueries';

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
  changeSelectedProfileHash: (hash) => { }
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
  const [pendingOwner, setPendingOwner] = useState<String>('')
  const { loading, error, profiles, hasProfiles, refetch } = fetchOwnedProfiles(address || '');
  const { memberProfiles, hasMemberProfiles } = fetchMemberProfiles(address || '');

  const changeSelectedProfileHash = (hash: string) => {
    setSelectedProfileHash(hash)
  }

  const refetchProfiles = async () => {
    const newProfiles = await refetch()
    setUserProfiles(newProfiles.data.profiles);
  }

  const getPendingOwner = async (registry: any, profiles: TransformedProfile[], memberProfiles: TransformedProfile[]) => {
    const rpc = 'https://rpc.goerli.eth.gateway.fm';
    const customProvider = new ethers.providers.JsonRpcProvider(rpc);
    const contractAddress = registry.contract.address;
    const contractAbi = registry.contract.abi;
    const readOnlyContract = new ethers.Contract(contractAddress, contractAbi, customProvider);
  
    try {
      const updatedProfiles = await Promise.all(profiles.map(async profile => {
        const pendingOwner = await readOnlyContract.profileIdToPendingOwner(profile.id);
        return { ...profile, pendingOwner };
      }));

      const updatedMemberProfiles = await Promise.all(memberProfiles.map(async profile => {
        const pendingOwner = await readOnlyContract.profileIdToPendingOwner(profile.id);
        return { ...profile, pendingOwner };
      }));
  
      setUserProfiles(updatedProfiles);
      setUserMemberProfiles(updatedMemberProfiles);
      console.log("updatedMemberProfiles", updatedMemberProfiles)
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
      if (registry && profiles) {
        getPendingOwner(registry, profiles, memberProfiles);
      }
    }
  }, [chainId, chain, address, isConnected, hasProfiles, selectedProfileHash]);

  return (
    <GlobalContext.Provider value={{
      registry, allo, microStrategy, provider, signer, userProfiles, hasProfiles,
      nonce, refetchProfiles, selectedProfileHash, changeSelectedProfileHash
    }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContext;