import { ReactNode, createContext, useEffect, useState } from 'react';
import { Allo, MicroGrantsStrategy, Registry } from '@allo-team/allo-v2-sdk';
import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { useNetwork } from "wagmi";
import { ethers } from 'ethers';
import { useUserProfiles } from '@/queries/userQueries';


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
  fetchProfiles: () => void;
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
  fetchProfiles: () => { },
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
  const [selectedProfileHash, setSelectedProfileHash] = useState<string>()
  const [nonce, setNonce] = useState<number>(0)
  const { loading, error, profiles, hasProfiles } = useUserProfiles('0x5052936d3c98d2d045da4995d37b0dae80c6f07f' || '');

  const changeSelectedProfileHash = (hash: string) => {
    setSelectedProfileHash(hash)
  }

  const fetchProfiles = async () => {
    if (!profiles) {
      console.log("No profiles found")
      return;
    }

    if (profiles.length === 0) {
      setNonce(profiles.length)
    } else {
      setNonce(profiles.length + 1)
    }

    setUserProfiles(profiles);
  }

  useEffect(() => {
    if (chainId) {
      setRegistry(new Registry({ chain: chainId, rpc: window.ethereum }));
      setAllo(new Allo({ chain: chainId, rpc: window.ethereum }));
      setMicroStrategy(new MicroGrantsStrategy({ chain: chainId, rpc: window.ethereum }));
      fetchProfiles()
    } else {
      console.log("ChainId undefined");
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);
    } else {
      console.log("Ethereum object doesn't exist on window. You should consider installing MetaMask!");
    }
  }, [chainId, chain, address, isConnected, hasProfiles, selectedProfileHash, changeSelectedProfileHash]);

  useEffect(() => {
  }, []);

  return (
    <GlobalContext.Provider value={{
      registry, allo, microStrategy, provider, signer, userProfiles, hasProfiles,
      nonce, fetchProfiles, selectedProfileHash, changeSelectedProfileHash
    }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContext;