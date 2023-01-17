import { createStitches } from '@stitches/react'

export const { styled, css } = createStitches({
  media: {
    smol: '(max-width: 1024px)'
  },
  utils: {
    // Abbreviated margin properties
    m: (value: number) => ({
      margin: value + 'px'
    }),
    mt: (value: number) => ({
      marginTop: value + 'px'
    }),
    mr: (value: number) => ({
      marginRight: value + 'px'
    }),
    mb: (value: number) => ({
      marginBottom: value + 'px'
    }),
    ml: (value: number) => ({
      marginLeft: value + 'px'
    }),
    mx: (value: number) => ({
      marginLeft: value + 'px',
      marginRight: value + 'px'
    }),
    my: (value: number) => ({
      marginTop: value + 'px',
      marginBottom: value + 'px'
    }),

    // A property for applying width/height together
    size: (value: { height: number; width: number }) => ({
      width: value + 'px',
      height: value + 'px'
    }),

    // A property to apply linear gradient
    linearGradient: (value: string) => ({
      backgroundImage: `linear-gradient(${value})`
    }),

    // An abbreviated property for border-radius
    br: (value: number) => ({
      borderRadius: value
    })
  }
})

export const Row = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  '@smol': {
    flexDirection: 'column'
  }
})

export const Col = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export const Input = styled('input', {
  width: 250,
  border: 'none',
  fontSize: '2rem',
  padding: 0,
  background: 'none',
  '@smol': {
    width: 150
  }
})

export const Image = styled('img', {
  width: '100%'
})
