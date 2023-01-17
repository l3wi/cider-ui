import { BigNumber, utils } from 'ethers'
import { useState } from 'react'
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import useCider from '../../contexts/useCider'
import { isNumeric, nFormatter } from '../../utils/helpers'
import { Col, Row } from '../helpers'
import { ciderABI } from '../../constants/cider'
import ConnectGuard from '../ConnectGuard'
import { CIDER_CONTRACT, GEAR_TOKEN } from '../../constants/config'
import ApproveGuard from '../ApproveGuard'

const SwapDialog: React.FC = () => {
  const { address: cider, config } = useCider()
  const { getCurrentShearingPct, stage } = config
  const { address } = useAccount()

  const [slippage, setSlippage] = useState(2.5)

  const [toggle, setToggle] = useState('GEAR')
  const [value, setValue] = useState({
    bn: BigNumber.from(0),
    string: '0.0'
  })

  const { data } = useContractRead({
    address: cider,
    abi: ciderABI,
    functionName:
      toggle === 'GEAR' ? 'getETHFromGEARAmount' : 'getGEARFromETHAmount',
    args: [value.bn]
  })

  const toggleSlippage = () => {
    switch (slippage) {
      case 0.5:
        setSlippage(1)
        break
      case 1:
        setSlippage(2.5)
        break
      case 2.5:
        setSlippage(5)
        break
      case 5:
        setSlippage(0.5)
        break
    }
  }

  const { data: balance } = useBalance({
    address,
    token: toggle === 'GEAR' ? GEAR_TOKEN : undefined,
    watch: true
  })

  const handleClick = () => {
    setValue({
      bn: BigNumber.from(0),
      string: '0.0'
    })
    setToggle(toggle === 'GEAR' ? 'ETH' : 'GEAR')
  }

  const updateValue = (input: string) => {
    if (isNumeric(input)) {
      const bn = utils.parseUnits(input, 18)
      return setValue({ bn, string: input.toString() })
    }
    return setValue({ ...value, string: input.toString() })
  }

  const { config: SwapConfig } = usePrepareContractWrite({
    address: CIDER_CONTRACT,
    abi: ciderABI,
    functionName: toggle === 'GEAR' ? 'sellGEAR' : 'buyGEAR',
    args:
      toggle === 'GEAR'
        ? [
            value.bn,
            data ? data.sub(data.div(100 / slippage)) : BigNumber.from(0)
          ]
        : [data ? data.sub(data.div(100 / slippage)) : BigNumber.from(0)],
    overrides:
      toggle === 'ETH'
        ? {
            gasLimit: BigNumber.from(600000),
            value: value.bn
          }
        : { gasLimit: BigNumber.from(600000) }
  })
  const { isLoading, write } = useContractWrite({
    ...SwapConfig,
    onSuccess(data) {
      alert('Swap sent')
    }
  })
  return (
    <wired-card
      fill={stage !== 3 ? 'rgba(0,0,0,0.3)' : 'rgb(162, 174, 222)'}
      style={{
        maxWidth: 900,
        width: '100%',
        padding: '2rem',
        margin: '2rem',
        textAlign: 'center',
        color: stage !== 3 ? 'rgba(0,0,0,0.4)' : 'inherit'
      }}
    >
      <Col>
        <h1>Swap tokens</h1>

        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          {balance ? (
            <Row
              style={{
                textTransform: 'uppercase',
                fontSize: '1.4rem',
                opacity: 0.7,
                marginBottom: '0px',
                justifyContent: 'space-between'
              }}
            >
              <span
                onClick={() => updateValue(balance?.formatted)}
              >{`balance: ${parseFloat(balance?.formatted).toFixed(3)} ${
                balance?.symbol
              }`}</span>
              <span
                onClick={() => toggleSlippage()}
              >{`slippage: ${slippage.toFixed(1)}%`}</span>
            </Row>
          ) : (
            <div style={{ height: 25 }} />
          )}
          <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
            <wired-card>
              <input
                style={{
                  width: 200,
                  border: 'none',
                  fontSize: '2rem',
                  padding: 0,
                  background: 'none',
                  color: stage !== 3 ? 'rgba(0,0,0,0.4)' : 'inherit'
                }}
                placeholder={'0.0'}
                value={value.string}
                //@ts-ignore
                onChange={(e) => updateValue(e.target.value)}
              />
            </wired-card>

            <wired-card onClick={() => handleClick()}>{toggle}</wired-card>
          </Row>
        </div>

        <h3>
          {`You will recieve 
          ${
            data instanceof BigNumber && !data.isZero()
              ? nFormatter(data, 18, 3)
              : '0.0'
          }
          ${toggle === 'GEAR' ? 'ETH' : 'GEAR'}`}
        </h3>
        <h3 style={{ marginBottom: '1rem' }}>
          {toggle === 'GEAR'
            ? `Extra selling fee is ${
                getCurrentShearingPct &&
                (
                  parseFloat(nFormatter(getCurrentShearingPct, 18, 5)) * 100
                ).toFixed(3)
              }
        %`
            : `The early buy fee is 0%`}
        </h3>

        {isLoading ? (
          //@ts-ignore
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
            {toggle === 'GEAR' ? (
              <ApproveGuard
                token={GEAR_TOKEN}
                spender={cider}
                amount={value.bn}
              >
                <wired-button
                  style={{
                    fontSize: '2rem',
                    marginLeft: '0.5rem'
                  }}
                  onClick={() => (write && stage === 3 ? write() : null)}
                >
                  Swap Tokens
                </wired-button>
              </ApproveGuard>
            ) : (
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => (write && stage === 3 ? write() : null)}
              >
                Swap Tokens
              </wired-button>
            )}
          </ConnectGuard>
        )}
      </Col>
    </wired-card>
  )
}

export default SwapDialog
