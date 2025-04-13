import React from 'react'
import PropTypes from 'prop-types'

const InformationLine = ({ title, value }) => {
	return (
		<div className='w-full flex justify-between items-center py-3 border-b border-[#c2c2c2]'>
			<span className='dark:text-white'>{title}</span>
			<span className='font-bold dark:text-white'>{value}</span>
		</div>
	)
}

InformationLine.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired
}

export default InformationLine