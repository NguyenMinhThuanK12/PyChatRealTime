import React from 'react'
import PropTypes from 'prop-types'
import { PiX, PiArrowCircleLeft } from 'react-icons/pi'
const Index = ({ children, onClick, isVisibleBlockList = false, setVisibleBlockList }) => {
	return (
		<div className="overlay">
			<div
				onClick={() => onClick(false)}
				className='w-screen h-screen fixed top-0 left-0 bg-black/20 z-[9] cursor-pointer' />
			<div className="bg-white dark:bg-primary-dark fixed inset-0 m-auto w-fit h-fit p-6 rounded-xl z-10 overflow-hidden">
				<div className="flex justify-end items-center">
					{
						isVisibleBlockList && (
							<button
								onClick={() => setVisibleBlockList(false)}
								type='button'
								className='absolute top-5 left-6 size-11 flex place-content-center p-2.5 bg-light-gray rounded-full hover:opacity-75'>
								<PiArrowCircleLeft size={25} className='w-full h-full' />
							</button>
						)
					}
					{children}
					<button
						onClick={() => onClick(false)}
						type='button'
						className='absolute top-5 size-11 flex place-content-center p-2.5 bg-light-gray rounded-full hover:opacity-75'>
						<PiX size={22} className='w-full h-full' />
					</button>
				</div>
			</div>
		</div>

	)
}

Index.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Index