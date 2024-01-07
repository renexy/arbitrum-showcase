import Layout from '@/components/layout/layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { GlobalContextProvider } from '@/hooks/context/ContextAggregator';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo/apolloClient';
import { wagmiConfig } from '../wagmiConfig';
import { chains } from '../wagmiConfig';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ApolloProvider client={client}>
            <GlobalContextProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
            </GlobalContextProvider>
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
  )
}