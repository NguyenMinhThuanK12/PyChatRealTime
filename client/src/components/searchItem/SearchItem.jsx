import React, { useEffect, useState } from 'react'
import Axios from '../../api/index'
import { FaUserCheck } from "react-icons/fa6";
import { Link } from 'react-router-dom';
const SearchItem = ({ item, sendReq,cancelReq }) => {
	const [searchValue, setSearchValue] = useState(item)
	useEffect(() => {
		setSearchValue(item)
	}, [item])

	return (
		<div className='w-full h-fit p-5 bg-[#f0f0f0] dark:bg-[#3a3b3c] flex justify-between items-center rounded-lg shadow-md'>
			<div className="w-full flex items-center gap-4">
				<Link to={`/profile/${searchValue.id}`} className="w-[85px] h-[85px] rounded-full overflow-hidden">
					<img loading='lazy' src={searchValue.avatar} alt="" className='w-full h-full object-cover object-center' />
				</Link>
				<div className="flex flex-col">
					<h1 className='dark:text-white font-medium'>{searchValue.username}</h1>
					<h1 className='text-sm text-gray-600'>{searchValue.email}</h1>
				</div>
			</div>
			<div className="flex gap-2 place-content-center">
				{
					searchValue.status == 'request_received' && (
						<button
							onClick={() => cancelReq(searchValue)}
							className={`w-auto px-3 py-2 bg-gray-400 dark:bg-primary hover:bg-primary-900 transition-all rounded-md`}>
							<span className='text-white text-sm font-medium whitespace-nowrap'>Cancel</span>
						</button>
					)
				}
				<button
					onClick={() => sendReq(searchValue)}
					className={`w-auto px-3 py-2 bg-primary-700 dark:bg-primary hover:bg-primary-900 transition-all rounded-md`}>
					<span className='text-white text-sm font-medium whitespace-nowrap'>{
						searchValue && searchValue.status === 'not_friend' ?
							'Add friend' : searchValue.status === 'request_sent' ?
								'Cancel Request' : searchValue.status === 'request_received' ? 'Accept' : searchValue.status === 'friends' && 'Friends'
					}</span>
				</button>
				{
					searchValue.status == 'friends' && (
						<button
							onClick={() => sendReq(searchValue)}
							className={`w-auto px-3 py-2 bg-gray-600 dark:bg-gray-200 hover:bg-primary-900 transition-all rounded-md`}>
							<FaUserCheck size={25} className='text-white' />
						</button>
					)
				}
			</div>
		</div>
	)
}

export default SearchItem