import Counter from '../components/Countdown'

import InfoCard from '../components/InfoCard'
import InputCard from '../components/InputCard'
import Layout from '../components/Layout'
import useCider from '../contexts/useCider'
import CiderBottle from '../components/CiderBottle'
import { GEAR_TOKEN } from '../constants/config'
import { Row } from '../components/helpers'

export default function DepositGear() {
  const { config, time, balances } = useCider()
  const { gearMaxAmount, totalGearCommitted, ethDepositStart } = config

  return (
    <Layout>
      <Counter
        text={`ETH deposits start in `}
        date={ethDepositStart}
        time={time}
      />

      <Row
        style={{
          justifyContent: 'space-around'
        }}
      >
        <InputCard symbol={'GEAR'} stage={1} token={GEAR_TOKEN} />
        <CiderBottle
          committed={balances}
          max={gearMaxAmount}
          current={totalGearCommitted}
          symbol={'GEAR'}
        />
      </Row>

      <InfoCard>
        <div>
          {`This is your chance to sell GEAR and/or bet on its volatility! 
          Deposit your GEAR and participate in the cider LP auction. Once
          Cider'ed ETH stage is done, you will get GEAR/ETH Curve V2 position at
          the same price as everyone else, claimable after the FairTrading
          stage.`}
        </div>
        <div style={{ paddingTop: 10 }}>
          {`Early LPs have the chance to earn the highest LP fees: 
FairTrading rewards + extra Liquidity Mining from block 1.`}{' '}
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
