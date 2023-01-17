import { Col } from '../components/helpers'
import Layout from '../components/Layout'

export default function Error() {
  return (
    <Layout>
      <wired-card
        fill={'#b51f3f'}
        style={{
          maxWidth: 900,
          width: '100%',
          padding: '2rem',
          margin: '2rem',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Col>
          <h1>{`Error`}</h1>
          <p>{`Couldn't find the page you were looking for!`}</p>
        </Col>
      </wired-card>
    </Layout>
  )
}
