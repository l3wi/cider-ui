import {
  useBlockNumber,
  useContract,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSigner
} from 'wagmi'
import { Col, Image, Row } from '../components/helpers'
import Layout from '../components/Layout'
import useCider from '../contexts/useCider'
import { ciderABI } from '../constants/cider'
import { nFormatter } from '../utils/helpers'
import { BigNumber, utils } from 'ethers'
import InfoCard from '../components/InfoCard'
import ConnectGuard from '../components/ConnectGuard'
import { useEffect, useState } from 'react'

export default function Wtihdraw() {
  const { config, address, curve } = useCider()

  const { stage, totalFees } = config
  const { data: signer } = useSigner()
  const { data: blockNumber } = useBlockNumber()
  const [lpTokens, setLpTokens] = useState(BigNumber.from(0))

  const contract = useContract({
    address: address,
    abi: ciderABI,
    signerOrProvider: signer
  })

  const { config: claimConfig } = usePrepareContractWrite({
    address: address,
    abi: ciderABI,
    functionName: 'claimLP'
  })
  const { isLoading, isSuccess, write } = useContractWrite({
    ...claimConfig,
    onSettled(data, error) {
      if (error) console.log('Failed', error)
      if (data) console.log('Success', data)
    }
  })

  useEffect(() => {
    const func = async () => {
      const lp = await contract?.getPendingLPAmount()
      if (lp) setLpTokens(lp)
    }

    if (signer) func()

    return () => {}
  }, [signer, blockNumber])

  // APY Calculations
  const tradingStart = 1671264000000
  const curveAPY =
    (((parseFloat(utils.formatEther(curve.virtualPrice)) - 1) *
      365 *
      24 *
      3600) /
      ((new Date().getTime() - tradingStart) / 1000)) *
    100

  const ciderFees = !totalFees.isZero()
    ? parseFloat(utils.formatEther(totalFees)) / 2
    : 0

  const RewardsPerMonth = 3330000 + ciderFees / 4

  const LMProgramAPY =
    (RewardsPerMonth / (2 * parseFloat(utils.formatEther(curve.gear)))) *
      12 *
      100 +
    curveAPY

  const LPValue = !lpTokens.isZero()
    ? (parseFloat(utils.formatEther(lpTokens)) /
        parseFloat(utils.formatEther(curve.totalLP))) *
      curve.tvl
    : 0
  return (
    <Layout>
      <InfoCard>
        <div style={{ textAlign: 'center' }}>
          {`0xCider participants got 50% of the Fair Trading fees. They will be 
          available via a merkle drop in the main dApp `}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://curve.fi/#/ethereum/pools/factory-crypto-192/deposit"
          >
            {`<rewards tab>.`}
          </a>
          {` Check 
          there if you got them.`}
        </div>
      </InfoCard>
      <wired-card
        fill={stage !== 4 ? 'rgba(0,0,0,0.3)' : '#48119592'}
        style={{
          maxWidth: 900,
          width: '100%',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center',
          color: stage !== 4 ? 'rgba(0,0,0,0.4)' : 'inherit'
        }}
      >
        <Col>
          <h1 style={{ color: '#a51f59' }}>{`GEAR/ETH LM program APY: ${
            LMProgramAPY < 1000 && LMProgramAPY.toFixed(2)
          }%`}</h1>

          <div>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://curve.fi/#/ethereum/pools/factory-crypto-192/deposit"
            >
              {`<LP now into Curve>`}
            </a>
            {` or just don’t unwrap your GEAR/ETH LP from 0xcider - 
            and earn rewards from two different LM programs! You don't need to stake it anywhere yet. 
            The rewards will be available every few days/weeks in the main dApp rewards tab. Later on, 
            there could be a Curve gauge requiring to stake into. More info about the `}

            <a
              rel="noreferrer"
              target="_blank"
              href="https://gov.gearbox.fi/t/gip-36-gear-weth-liquidity-mining/2143"
            >
              {`<LM program>.`}
            </a>
          </div>
          {!lpTokens.isZero() ? (
            <Row style={{ justifyContent: 'center', marginTop: 15 }}>
              <h3>
                {`Your LP Tokens: ${nFormatter(
                  lpTokens,
                  18,
                  3
                )} crvGEARETH-f (~$${LPValue.toFixed(2)})`}
              </h3>
            </Row>
          ) : (
            <Row style={{ justifyContent: 'center', marginTop: 15 }}>
              <h3>
                {`Your LP Tokens: 0.0 crvGEARETH-f (~$${LPValue.toFixed(2)})`}
              </h3>
            </Row>
          )}

          <Row style={{ justifyContent: 'center' }}>
            <wired-button
              style={{
                fontSize: '2rem',
                marginLeft: '0.5rem'
              }}
              onClick={() =>
                window.open(
                  'https://curve.fi/#/ethereum/pools/factory-crypto-192/deposit'
                )
              }
            >
              Deposit Assets
            </wired-button>
            {isSuccess ? (
              <wired-button
                style={{
                  width: 'fit-content',
                  fontSize: '2rem'
                }}
              >
                TX Succeeded
              </wired-button>
            ) : isLoading ? (
              <wired-button
                style={{
                  width: 'fit-content',
                  fontSize: '2rem',
                  marginTop: '0.5rem'
                }}
              >
                loading...
              </wired-button>
            ) : (
              <ConnectGuard>
                <wired-button
                  style={{
                    fontSize: '2rem',
                    marginLeft: '0.5rem'
                  }}
                  onClick={() => write && write()}
                >
                  Claim LP Tokens
                </wired-button>
              </ConnectGuard>
            )}
          </Row>
        </Col>
      </wired-card>
      <Image src="./withdraw_2.jpeg" />
      <Image src="./withdraw_1.jpeg" />
    </Layout>
  )
}
