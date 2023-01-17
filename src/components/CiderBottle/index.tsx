import { BigNumber } from 'ethers'

import { currency, nFormatter } from '../../utils/helpers'
import { Col } from '../helpers'

type Props = {
  max: BigNumber
  current: BigNumber
  symbol: string
  committed: BigNumber[]
  children?: React.ReactNode
}

export default function CiderBottle(props: Props) {
  const { max, current, symbol, committed } = props
  if (current && max) {
    const fill =
      Math.floor(
        (parseInt(current.toString()) / parseInt(max.toString())) * 5
      ) * 2
    return (
      <Col style={{ color: '#A2AEDE' }}>
        <img
          src={fill ? `./${fill > 1 && fill}0.png` : './0.png'}
          alt={'Cider bottle'}
          height={256}
          width={168}
        />
        {committed && (
          <>
            <div>
              {`Total ${symbol} Committed: `}{' '}
              {currency.format(parseFloat(nFormatter(current, 18, 2)))}
            </div>
            <div>
              {`Your committed ${symbol}: `}{' '}
              {currency.format(
                parseFloat(
                  nFormatter(
                    symbol === 'GEAR' ? committed[0] : committed[1],
                    18,
                    2
                  )
                )
              )}
            </div>
          </>
        )}
      </Col>
    )
  } else {
    return null
  }
}
