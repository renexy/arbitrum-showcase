import Layout from '@/components/layout/layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  arbitrumGoerli,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import ProfileContext, { ProfileContextProvider } from '@/store/profileContext';

export default function App({ Component, pageProps }: AppProps) {

  const { chains, publicClient } = configureChains(
    [arbitrum, arbitrumGoerli],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_KEY || "" }),
      publicProvider()
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: 'Allocade',
    projectId: '338d7a50085fd3e1feab1df8e80a2819',
    chains
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ProfileContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ProfileContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
