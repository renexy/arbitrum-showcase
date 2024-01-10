import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from 'wagmi/providers/public';
import {
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  goerli,
} from 'wagmi/chains';

export const { chains, publicClient } = configureChains(
  [arbitrum, arbitrumSepolia, goerli],
  [
    publicProvider()
  ]
);

export const { connectors } = getDefaultWallets({
  appName: 'Allocade',
  projectId: '338d7a50085fd3e1feab1df8e80a2819',
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})