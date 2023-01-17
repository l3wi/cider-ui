import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import useCider from '../../contexts/useCider'
import { ciderABI } from '../../constants/cider'
import { isNumeric, nFormatter } from '../../utils/helpers'
import ApproveGuard from '../ApproveGuard'
import ConnectGuard from '../ConnectGuard'
import { Col, Input, Row } from '../helpers'

type Props = {
  stage: number
  token?: `0x${string}` | undefined
  symbol?: string
  isDisabled?: boolean
}

const InputCard: React.FC<Props> = ({ stage, token, symbol, isDisabled }) => {
  const [range, setRange] = useState({
    minPrice: BigNumber.from(0),
    maxPrice: BigNumber.from(0)
  })
  const { address: ciderAddress, price, config: CiderConfig } = useCider()
  const {
    stage: currentStage,
    getPriceRangeGearEth,
    ethMaxAmount,
    gearMaxAmount,
    totalEthCommitted,
    totalGearCommitted
  } = CiderConfig

  useEffect(() => {
    const func = async () => {
      //@ts-ignore
      setRange(getPriceRangeGearEth)
    }

    if (getPriceRangeGearEth) func()
  }, [getPriceRangeGearEth])

  const disabled = isDisabled || currentStage !== stage

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
    token,
    watch: true
  })

  const [value, setValue] = useState({
    bn: BigNumber.from(0),
    string: '0.0'
  })

  const updateValue = (input: string) => {
    if (isNumeric(input)) {
      const bn = utils.parseUnits(input, 18)
      return setValue({ bn, string: input.toString() })
    }
    return setValue({ ...value, string: input.toString() })
  }

  const setMax = () => {
    const delta = !token
      ? ethMaxAmount.sub(totalEthCommitted)
      : ethMaxAmount.sub(totalEthCommitted)

    if (balance) {
      if (balance.value > delta) {
        updateValue(utils.formatUnits(delta, 18))
      } else {
        updateValue(balance.formatted)
      }
    }
  }
  const isFull = () => {
    if (!token) {
      const full = totalEthCommitted.eq(ethMaxAmount) ? true : false
      return full
    } else {
      const full = totalGearCommitted.eq(gearMaxAmount) ? true : false
      return full
    }
  }
  return (
    <wired-card
      fill={disabled ? 'rgba(0,0,0,0.3)' : 'inherit'}
      style={{
        maxWidth: 500,
        width: '100%',
        padding: '2rem',
        margin: '2rem',
        textAlign: 'center',
        color: disabled ? 'rgba(0,0,0,0.4)' : 'inherit'
      }}
    >
      <Col>
        <h1 style={{ margin: '0' }}>deposit {symbol}</h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          {balance && (
            <span
              style={{
                textTransform: 'uppercase',
                fontSize: '1.4rem',
                opacity: 0.7,
                marginBottom: '0px',
                textAlign: 'left'
              }}
            >{`balance: ${parseFloat(balance?.formatted).toFixed(3)} ${
              balance?.symbol
            }`}</span>
          )}

          <Row>
            <wired-card>
              <Input
                disabled={disabled}
                style={{
                  color: disabled ? 'rgba(0, 0, 0, 0.4)' : 'inherit'
                }}
                placeholder={'0.0'}
                value={value.string}
                //@ts-ignore
                onChange={(e) => updateValue(e.target.value)}
              />
            </wired-card>
            <wired-button
              style={{
                fontSize: '2rem',
                marginLeft: '0.5rem'
              }}
              onClick={() => setMax()}
            >
              MAX
            </wired-button>
          </Row>
        </div>

        <div>{`$GEAR price range:`}</div>
        <h2 style={{ margin: '0' }}>
          {range.maxPrice &&
            `$${(price / parseFloat(nFormatter(range.maxPrice, 18, 2))).toFixed(
              4
            )} to $${(
              price / parseFloat(nFormatter(range.minPrice, 18, 2))
            ).toFixed(4)}`}
        </h2>

        <>
          <ConnectGuard>
            <ApproveGuard
              token={token}
              spender={ciderAddress}
              amount={value.bn}
            >
              {disabled ? (
                <wired-button
                  style={{
                    width: 'fit-content',
                    fontSize: '2rem',
                    marginTop: '0.5rem'
                  }}
                >
                  deposit
                </wired-button>
              ) : (
                <>
                  {!isFull() ? (
                    token ? (
                      <TokenButton
                        address={ciderAddress}
                        token={token}
                        amount={value.bn}
                      />
                    ) : (
                      <ETHButton amount={value.bn} address={ciderAddress} />
                    )
                  ) : (
                    <wired-button
                      style={{
                        width: 'fit-content',
                        fontSize: '2rem',
                        marginTop: '0.5rem'
                      }}
                    >
                      bottle is full
                    </wired-button>
                  )}
                </>
              )}
            </ApproveGuard>
          </ConnectGuard>
        </>
        <h4 style={{ marginTop: 10 }}>
          You can buy with 0% fee in the next phase
        </h4>
      </Col>
    </wired-card>
  )
}

const TokenButton: React.FC<{
  token?: `0x${string}`
  address: `0x${string}`

  amount: BigNumber
}> = ({ token, address, amount }) => {
  const { config } = usePrepareContractWrite({
    address: address,
    abi: ciderABI,
    functionName: 'commitGEAR',
    args: [amount]
  })
  const { isLoading, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      alert('Successfully Deposited')
    }
  })

  if (isLoading) {
    //@ts-ignore
    return (
      <wired-button
        style={{
          width: 'fit-content',
          fontSize: '2rem',
          marginTop: '0.5rem'
        }}
      >
        loading...
      </wired-button>
    )
  } else {
    return (
      <wired-button
        style={{
          width: 'fit-content',
          fontSize: '2rem',
          marginTop: '0.5rem'
        }}
        onClick={() => write && write()}
      >
        deposit
      </wired-button>
    )
  }
}

const ETHButton: React.FC<{
  address: `0x${string}`
  amount: BigNumber
}> = ({ address, amount }) => {
  const { config } = usePrepareContractWrite({
    address: address,
    abi: ciderABI,
    functionName: 'commitETH',
    overrides: {
      value: amount
    }
  })
  const { isLoading, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      alert('Successfully Deposited')
    }
  })
  if (isLoading) {
    //@ts-ignore
    return (
      <wired-button
        style={{
          width: 'fit-content',
          fontSize: '2rem',
          marginTop: '0.5rem'
        }}
      >
        loading...
      </wired-button>
    )
  } else {
    return (
      <wired-button
        style={{
          width: 'fit-content',
          fontSize: '2rem',
          marginTop: '0.5rem'
        }}
        onClick={() => write && write()}
      >
        deposit
      </wired-button>
    )
  }
}

export default InputCard
