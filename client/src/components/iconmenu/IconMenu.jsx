import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'
import useConversation from '../../zustand/useConversation'
const IconMenu = ({ to, Icon, title }) => {
	const { totalRespond } = useConversation()
	return (
		<>
			<NavLink
				id='test'
				data-tooltip-id="my-tooltip"
				data-tooltip-content={title}
				data-tooltip-place="right"
				data-tooltip-offset={20}
				to={to} className={`w-[55px] h-[55px] flex justify-center items-center rounded-lg hover:bg-primary group transition-all relative`}>
				{
					totalRespond > 0 && title == "Friends List" && (
						<span className='absolute -top-2 -right-2 size-5 rounded-full bg-black text-white flex justify-center items-center text-sm p-1'>
							{totalRespond}
						</span>
					)
				}
				{Icon && <Icon size={29} className={`group-hover:text-white dark:text-dark-gray activeIcon`} />}
			</NavLink>
			<Tooltip id="my-tooltip" style={{ backgroundColor: "#3fbf9e", fontWeight: "500", zIndex: 1000 }} />
		</>
	)
}
IconMenu.propTypes = {
	to: PropTypes.string,
	Icon: PropTypes.elementType,
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func,
}

export default IconMenu