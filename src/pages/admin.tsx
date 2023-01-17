import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useProvider
} from 'wagmi'
import { Col, Row } from '../components/helpers'
import Layout from '../components/Layout'
import useCider from '../contexts/useCider'
import { ciderABI } from '../constants/cider'
import { advanceTime, mineBlock } from '../utils/hardhat'
import { BigNumber } from 'ethers'

export default function Admin() {
  const { config, address } = useCider()
  const {
    stage,
    gearDepositStart,
    ethDepositStart,
    fairTradingStart,
    fairTradingEnd
  } = config

  const provider = useProvider()
  const { address: user } = useAccount()
  const { config: advanceConfig } = usePrepareContractWrite({
    address,
    abi: ciderABI,
    functionName: 'advanceStage',
    overrides: {
      gasLimit: BigNumber.from(400000)
    }
  })

  const { write } = useContractWrite({
    ...advanceConfig,
    onSuccess() {
      //@ts-ignore
      mineBlock(provider)
    },
    onSettled(data, error) {
      if (error) console.log('Failed', error)
      if (data) console.log('Success', data)
    }
  })

  const advance = async (time: number) => {
    if (user) {
      //@ts-ignore
      await advanceTime(time, provider)
    }
  }

  return (
    <Layout>
      <wired-card
        fill={'#48119592'}
        style={{
          maxWidth: 900,
          width: '100%',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center',
          color: 'inherit'
        }}
      >
        <Col>
          <h2>Admin Panel</h2>
          <Row>
            {stage === 0 ? (
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => advance(gearDepositStart.toNumber())}
              >
                Time to GEAR Deposit
              </wired-button>
            ) : stage === 1 ? (
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => advance(ethDepositStart.toNumber())}
              >
                Time to ETH Deposit
              </wired-button>
            ) : stage === 2 ? (
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => advance(fairTradingStart.toNumber())}
              >
                Time to FairTrading
              </wired-button>
            ) : (
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => advance(fairTradingEnd.toNumber())}
              >
                Time to Withdraw
              </wired-button>
            )}
            <wired-button
              style={{
                fontSize: '2rem',
                marginLeft: '0.5rem'
              }}
              onClick={() => write && write()}
            >
              AdvanceStage()
            </wired-button>
            <wired-button
              style={{
                fontSize: '2rem',
                marginLeft: '0.5rem'
              }}
              //@ts-ignore
              onClick={() => mineBlock(provider)}
            >
              Mine Block
            </wired-button>
          </Row>
        </Col>
      </wired-card>
    </Layout>
  )
}
