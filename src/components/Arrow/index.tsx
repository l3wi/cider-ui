import ReactRough, { Line, Path } from 'react-rough'
import { useState, useEffect } from 'react'

export default function Arrow() {
  const size: Size = useWindowSize()

  if (size.width && size.width > 1024) {
    return (
      //@ts-ignore
      <ReactRough
        height={50}
        width={100}
        config={{
          options: {
            strokeWidth: 6
          }
        }}
        renderer="svg"
      >
        <Line y2={25.74999} x2={76.12652} y1={25.74999} x1={4.12536} />
        <Path d="m55.87495,46.49983c0.99999,-0.6708 20.99983,-22.80728 20.87444,-22.80746c0.12539,0.00018 -17.62446,-13.19227 -17.74986,-13.19245" />
      </ReactRough>
    )
  } else {
    return null
  }
}

interface Size {
  width: number | undefined
  height: number | undefined
}

function useWindowSize(): Size {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined
  })
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}
