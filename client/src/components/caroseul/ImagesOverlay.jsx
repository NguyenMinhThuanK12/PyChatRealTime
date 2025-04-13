import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import useConversation from '../../zustand/useConversation';
import { PiX } from 'react-icons/pi'
import './caroseul.css'
const ImagesOverlay = ({ images }) => {
	const { isOpenCarosuel, setIsOpenCarosuel, selectedImage } = useConversation()
	const selectedImageIndex = () => {
		if (selectedImage.includes('http')) {
			return images.findIndex(image => image === selectedImage)
		} else {
			return parseInt(selectedImage)
		}
	}
	console.log(selectedImageIndex())
	return (
		<div className="w-full h-full absolute px-10 pt-10 inset-0 bg-black/90 z-20">
			<span onClick={() => setIsOpenCarosuel(false)} className='absolute flex justify-center items-center w-fit h-fit p-2 bg-white/80 rounded-full right-10 top-5 z-30 cursor-pointer hover:opacity-75'>
				<PiX size={22} />
			</span>
			<Carousel
				selectedItem={selectedImageIndex()}
				thumbWidth={60}
				showArrows={true}
				showStatus={false}
				showThumbs={true}
				showIndicators={false}
				className='w-full h-full flex flex-col justify-center items-center text-center'>
				{/* {
				Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className='w-full'>
						<img src="https://picsum.photos/1440/1080" alt="" className='size-full object-cover' />
					</div>
				))
			} */}
				{
					images.map((image, index) => (
						<div key={index} className=''>
							<img src={image} alt="" />
						</div>
					))
				}
			</Carousel>
		</div>
	)
}

export default ImagesOverlay