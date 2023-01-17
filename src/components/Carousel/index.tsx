import ImageGallery from 'react-image-gallery'

type Props = {}

export default function Carousel(props: Props) {
  const images = [
    {
      original: './trading_2.jpeg'
    },
    {
      original: './trading_1.jpeg'
    },

    {
      original: './trading_3.jpeg'
    },
    {
      original: './trading_4.jpeg'
    }
  ]
  return (
    <ImageGallery
      items={images}
      showNav={false}
      showFullscreenButton={false}
      showPlayButton={false}
      showBullets={false}
      showThumbnails={false}
      autoPlay={true}
      slideInterval={15000}
    />
  )
}
