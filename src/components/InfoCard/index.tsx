type Props = {
  children?: React.ReactNode
}

export default function InfoCard(props: Props) {
  return (
    <wired-card
      fill="rgba(210, 60, 185, 0.279)"
      style={{
        maxWidth: 850,
        width: 'fit-content',
        padding: '1rem',
        margin: '1rem'
      }}
    >
      {props.children}
    </wired-card>
  )
}
