import React, { useState } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'

type Props = {
  children?: React.ReactNode
}

export default function ConnectGuard(props: Props) {
  const { chain } = useNetwork()

  const { isConnected } = useAccount()

  const correctChain =
    (chain && chain.id === 1) ||
    (chain && chain.id === 31337) ||
    (chain && chain.id === 1337)
  return (
    <div>
      {isConnected ? (
        correctChain ? (
          props.children
        ) : (
          <WrongNetwork />
        )
      ) : (
        <ConnectButton />
      )}
    </div>
  )
}

const WrongNetwork: React.FC<{ smol?: boolean }> = ({ smol }) => {
  return (
    <wired-button
      style={{
        width: 'fit-content',
        fontSize: smol ? '2rem' : '1.5rem',
        marginTop: '0.5rem'
      }}
    >
      wrong network
    </wired-button>
  )
}

const ConnectButton: React.FC<{ smol?: boolean }> = ({ smol }) => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  const [modal, setModal] = useState(false)
  return (
    <>
      <wired-button
        onClick={() => setModal(true)}
        style={{
          width: 'fit-content',
          fontSize: smol ? '2rem' : '1.5rem',
          marginTop: '0.5rem'
        }}
      >
        connect wallet
      </wired-button>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          visibility: modal ? 'visible' : 'hidden'
        }}
      >
        <wired-card fill="#FFF">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2rem',
              minWidth: 400
            }}
          >
            <h1 style={{ margin: 0 }}>connect wallet</h1>
            {connectors.map((connector, i) => (
              <wired-button
                //@ts-ignore
                key={'connector' + i}
                onClick={() => connect({ connector })}
                style={{ fontSize: '2rem', margin: '20px 0' }}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </wired-button>
            ))}
            {error && <div>{error.message}</div>}
          </div>
        </wired-card>
      </div>
    </>
  )
}
