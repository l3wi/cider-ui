import { BigNumber } from 'ethers'
import Countdown from 'react-countdown'

type Props = {
  text: string
  date: BigNumber
  time: number
  children?: React.ReactNode
}

export default function Counter(props: Props) {
  const { date, time, text } = props

  if (date && date.toNumber() >= time) {
    return (
      <h2 style={{ color: '#be3d3d' }}>
        {text}
        {!date.isZero() && <Countdown date={date.toNumber() * 1000} />}
      </h2>
    )
  } else {
    return (
      <h2
        style={{ color: '#be3d3d' }}
      >{`the next stage has already started.`}</h2>
    )
  }
}
