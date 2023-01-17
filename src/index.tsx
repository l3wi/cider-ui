import ReactDOM from 'react-dom/client'
import './index.css'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/home'
import DepositGear from './pages/deposit-gear'
import DepositEth from './pages/deposit-eth'
import FairTrading from './pages/fair-trading'
import Wtihdraw from './pages/withdraw'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  chain,
  configureChains
} from 'wagmi'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CiderProvider } from './contexts/useCider'
import Error from './pages/card'
import Admin from './pages/admin'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.localhost, chain.hardhat],
  [
    // jsonRpcProvider({
    //   rpc: (chain) => ({
    //     http: `http://localhost:8545`
    //   })
    // }),
    publicProvider()
  ]
)

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
})

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/deposit-gear',
    element: <DepositGear />
  },
  {
    path: '/deposit-eth',
    element: <DepositEth />
  },
  {
    path: '/fair-trading',
    element: <FairTrading />
  },
  {
    path: '/withdraw',
    element: <Wtihdraw />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/*',
    element: <Error />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <WagmiConfig client={client}>
    <CiderProvider>
      <RouterProvider router={router} />
    </CiderProvider>
  </WagmiConfig>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
