import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const FriendItem = ({ className, friend, sendReq, cancelReq }) => {

	return (
		<div className={`${className} p-3 flex flex-col gap-3 justify-center items-center bg-white rounded-lg`}>
			<Link to={`/profile/${friend.friend.id}`} className="size-36 overflow-hidden rounded-full border-2 border-gray-100">
				<img loading='lazy' src={friend.friend.avatar} alt="" className='w-full h-full object-cover object-center' />
			</Link>
			<div className="flex flex-col items-center">
				<span className='font-semibold'>{friend.friend.username}</span>
				<span className='text-gray-500'>{friend.friend.email}</span>
			</div>
			<div className="w-full flex gap-2">
				{/* //create one button with unfriend when friend.status == 'friends' */}
				{
					window.location.pathname.includes('profile') == false && friend.status === 'friends' && (
						<button
							onClick={() => sendReq(friend)}
							className='w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-75 transition-opacity'>Unfriend</button>
					)
				}
				{/* //create two button with Cancel and Accept when friend.status == 'request_received' */}
				{
					friend.status === 'request_received' && (
						<>
							<button
								onClick={() => cancelReq(friend)}
								className='w-full border-2 text-gray-700 py-2 rounded-lg font-medium hover:opacity-75 transition-opacity'>Cancel</button>
							<button
								onClick={() => sendReq(friend)}
								className='w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-75 transition-opacity'>Accept</button>
						</>
					)
				}
				{/* //create one button with Remove when friend.status == 'request_sent' */}
				{
					friend.status === 'request_sent' && (
						<button
							onClick={() => sendReq(friend)}
							className='w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-75 transition-opacity'>Cancel Request</button>
					)
				}
			</div>
		</div>
	)
}
FriendItem.defaultProps= {
	sendReq: () => {},
	cancelReq: () => {}
}
FriendItem.propTypes = {
	className: PropTypes.string,
	friend: PropTypes.object,
	sendReq: PropTypes.func,
	cancelReq: PropTypes.func
}

export default FriendItem