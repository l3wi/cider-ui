import CiderBottle from '../components/CiderBottle'
import Counter from '../components/Countdown'
import { Row } from '../components/helpers'

import InfoCard from '../components/InfoCard'
import InputCard from '../components/InputCard'
import Layout from '../components/Layout'
import useCider from '../contexts/useCider'

export default function DepositEth() {
  const { config, time, balances } = useCider()
  const { ethMaxAmount, totalEthCommitted, fairTradingStart } = config

  return (
    <Layout>
      <Counter
        text={`Fair trading starts in `}
        date={fairTradingStart}
        time={time}
      />

      <Row
        style={{
          justifyContent: 'space-around'
        }}
      >
        <InputCard symbol={'ETH'} stage={2} />
        <CiderBottle
          max={ethMaxAmount}
          current={totalEthCommitted}
          committed={balances}
          symbol={'ETH'}
        />
      </Row>
      <InfoCard>
        <div>
          {`This is your chance to buy GEAR and/or bet on its volatility! Deposit your ETH 
            and participate in the cider LP auction. Once Cider'ed ETH stage is done, 
            you will get GEAR/ETH Curve V2 position at the same price as everyone else, claimable 
            after the FairTrading stage. `}
        </div>
        <div style={{ paddingTop: 10 }}>
          {`Early LPs have the chance to earn the highest LP fees: 
FairTrading rewards + extra Liquidity Mining from block 1. `}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://medium.com/gearbox-protocol/gear-cidered-liquidity-launch-explainer-37e5882f4d91"
          >
            {`<Read more about it>.`}
          </a>
        </div>
      </InfoCard>
    </Layout>
  )
}
