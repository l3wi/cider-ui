import { BigNumber } from 'ethers'
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { nFormatter } from '../../utils/helpers'
import useCider from '../../contexts/useCider'
import { ciderABI } from '../../constants/cider'
import ConnectGuard from '../ConnectGuard'
import { Col, Row } from '../helpers'

const FailedDialog: React.FC = () => {
  const { address: cider } = useCider()
  const { address } = useAccount()

  const { data } = useContractReads({
    contracts: ['ethCommitted', 'gearCommitted'].map((functionName) => ({
      address: cider,
      abi: ciderABI,
      functionName,
      args: [address]
    })),
    watch: true,
    cacheTime: 5000
  })

  const { config: ethConfig } = usePrepareContractWrite({
    address: cider,
    abi: ciderABI,
    functionName: 'retrieveETH'
  })
  const { write: retrieveETH } = useContractWrite({
    ...ethConfig,
    onSettled(data, error, variables, context) {
      if (data) alert('Success')
      if (error) alert(`Failed: ${error}`)
    }
  })

  const { config: gearConfig } = usePrepareContractWrite({
    address: cider,
    abi: ciderABI,
    functionName: 'retrieveGEAR'
  })
  const { write: retrieveGEAR } = useContractWrite({
    ...gearConfig,
    onSettled(data, error) {
      if (data) alert('Success')
      if (error) alert(`Failed: ${error}`)
    }
  })

  return (
    <wired-card
      fill={'#b42dbd92'}
      style={{
        maxWidth: 900,
        width: '100%',
        padding: '2rem',
        margin: '2rem',
        textAlign: 'center',
        color: 'inherit'
      }}
    >
      <h2 style={{ margin: 0 }}>{`Cider'ed Liquidity Failed`}</h2>
      <p>{`The thresholds for ETH or GEAR tokens wasn't met. This means the 
        cider process has failed. You can recover your tokens below:`}</p>
      {data && (
        <Row style={{ justifyContent: 'space-around' }}>
          <Col>
            <h3>
              GEAR:{' '}
              {data[1] instanceof BigNumber
                ? nFormatter(data[1], 18, 2)
                : '0.00'}
            </h3>
            <ConnectGuard>
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => retrieveGEAR && retrieveGEAR()}
              >
                withdraw gear
              </wired-button>
            </ConnectGuard>
          </Col>
          <Col>
            <h3>
              ETH:{' '}
              {data[0] instanceof BigNumber
                ? nFormatter(data[0], 18, 2)
                : '0.00'}
            </h3>

            <ConnectGuard>
              <wired-button
                style={{
                  fontSize: '2rem',
                  marginLeft: '0.5rem'
                }}
                onClick={() => retrieveETH && retrieveETH()}
              >
                withdraw eth
              </wired-button>
            </ConnectGuard>
          </Col>
        </Row>
      )}
    </wired-card>
  )
}

export default FailedDialog
