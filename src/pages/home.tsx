import { useNavigate } from 'react-router-dom'
import Counter from '../components/Countdown'
import Layout from '../components/Layout'
import useCider from '../contexts/useCider'

export default function Home() {
  const { config, time } = useCider()
  const { stage, gearDepositStart } = config

  const navigate = useNavigate()

  return (
    <Layout>
      <wired-card
        fill={'#A2AEDE'}
        style={{
          maxWidth: 700,
          width: '100%',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center'
        }}
      >
        <h2>{`Welcome to GEARBOX's Cider liquidity event`}</h2>
        <p>
          {`This is a novel process which helps the GEAR token 
          with price discovery & liquidity. This event will run over 
          10 days, with 4 distinct stages. So make sure you are following
          the announcement for the latest updates!`}
        </p>
        {gearDepositStart && time > gearDepositStart.toNumber() ? (
          <wired-button
            style={{
              fontSize: '2rem',
              marginLeft: '0.5rem'
            }}
            onClick={() =>
              stage === 1
                ? navigate('/deposit-gear')
                : stage === 2
                ? navigate('/deposit-eth')
                : stage === 3
                ? navigate('/fair-trading')
                : navigate('/withdraw')
            }
          >
            Get started
          </wired-button>
        ) : (
          <Counter
            text={`GEAR deposits start in `}
            date={gearDepositStart}
            time={time}
          />
        )}
      </wired-card>
    </Layout>
  )
}
