import Carousel from '../components/Carousel'
import { Image } from '../components/helpers'
import InfoCard from '../components/InfoCard'
import Layout from '../components/Layout'
import SwapDialog from '../components/SwapDialog'

export default function FairTrading() {
  return (
    <Layout>
      <SwapDialog />
      <InfoCard>
        <div>
          {`Trade GEAR/ETH before full transferability. Keep in mind 
          there is a 25% fee for selling at the beginning of this stage. This decays to 
          0% at the end of the stage. No buying fee!`}
        </div>
      </InfoCard>
      {/* <Carousel /> */}
      <Image src="./trading_1.jpeg" />
    </Layout>
  )
}
