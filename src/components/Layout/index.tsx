import { useLocation, useNavigate } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import useCider from '../../contexts/useCider'
import Arrow from '../Arrow'
import ConnectGuard from '../ConnectGuard'
import FailedDialog from '../FailedDialog'
import { Col, Row } from '../helpers'
type Props = {
  children?: React.ReactNode
}

export default function Home({ children }: Props) {
  const { config } = useCider()
  const { stage } = config
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const navigate = useNavigate()

  return (
    <Col style={{ fontSize: '2rem', padding: '0rem 2rem' }}>
      <Col style={{ width: '100%', maxWidth: 1440 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            padding: '1rem 0rem',
            width: '100%'
          }}
        >
          <Row style={{ alignItems: 'baseline' }}>
            <h2 onClick={() => navigate('/')}>{`Cidered’ed Liquidity`}</h2>
          </Row>

          <Row style={{ justifyContent: 'flex-end', alignItems: 'end' }}>
            {isConnected ? (
              <Row
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'baseline'
                }}
              >
                <div>Wallet: {address?.slice(0, 6)}</div>
                <wired-button
                  style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }}
                  onClick={() => disconnect()}
                >
                  disconnect
                </wired-button>
              </Row>
            ) : (
              <ConnectGuard />
            )}
          </Row>
        </div>

        <main style={{ width: '100%' }}>
          <wired-card
            elevation={3}
            style={{
              width: '100%',
              padding: '2rem'
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {stage !== 5 && (
                <Row
                  style={{
                    justifyContent: 'space-around',
                    paddingBottom: '1rem'
                  }}
                >
                  <LinkItem
                    stage={
                      stage === 1 ? 'active' : stage > 1 ? 'past' : 'prior'
                    }
                    slug={'/deposit-gear'}
                    title={'1. deposit GEAR'}
                  />
                  <Arrow />
                  <LinkItem
                    stage={
                      stage === 2 ? 'active' : stage > 2 ? 'past' : 'prior'
                    }
                    slug={'/deposit-eth'}
                    title={'2. deposit ETH'}
                  />
                  <Arrow />

                  <LinkItem
                    stage={
                      stage === 3 ? 'active' : stage > 3 ? 'past' : 'prior'
                    }
                    slug={'/fair-trading'}
                    title={'3. fair trading'}
                  />
                  <Arrow />

                  <LinkItem
                    stage={
                      stage === 4 ? 'active' : stage > 4 ? 'past' : 'prior'
                    }
                    slug={'/withdraw'}
                    title={'4. GEAR/ETH LP'}
                  />
                </Row>
              )}

              {stage === 5 ? <FailedDialog /> : children}

              <div style={{ margin: '0.5rem' }}>
                {`This contract was audited by `}
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://github.com/Cidermancer/gear-auction/blob/main/audit/ChainSecurity_GEARBOX_Gearbox_Auction_audit.pdf"
                >
                  ChainSecurity
                </a>
                .
              </div>
            </div>
          </wired-card>
        </main>
      </Col>
    </Col>
  )
}

const LinkItem: React.FC<{ slug: string; stage: string; title: string }> = ({
  slug,
  stage,
  title
}) => {
  const navigate = useNavigate()
  let location = useLocation()
  return (
    <wired-card
      onClick={() => navigate(slug)}
      fill={
        location.pathname === slug
          ? '#2a50af'
          : stage === 'active'
          ? '#198b3b'
          : stage === 'past'
          ? '#adadad'
          : undefined
      }
      style={{
        color:
          location.pathname === slug
            ? '#fff'
            : stage === 'active'
            ? '#fff'
            : stage === 'past'
            ? '#3a3a3a'
            : '#2a50af',
        cursor: 'pointer',
        marginTop: 5
      }}
    >
      {title}
    </wired-card>
  )
}
