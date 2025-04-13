import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
const SocialMediaButton = ({ name, Icon, color }) => {
	return (
		<button onClick={() => toast.info("This function is currently unavailabel")} className='w-full lg:w-[152px] border flex justify-center items-center gap-2 px-4 py-3 rounded-md hover:bg-primary-900 group transition-all'>
			{Icon && <Icon size={25} className="" color={color ? color : ''} />}
			<span className='text-base group-hover:text-white font-medium'>{name}</span>
		</button>
	)
}
SocialMediaButton.propTypes = {
	name: PropTypes.string,
	Icon: PropTypes.element,
	color: PropTypes.string

}
export default SocialMediaButton