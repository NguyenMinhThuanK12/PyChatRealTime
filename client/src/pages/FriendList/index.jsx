import React, { useEffect, useState } from 'react';
import CustomizeInput from '../../components/input/CustomizeInput';
import FriendItem from '../../components/friendItem/FriendItem';
import { useLoaderData } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import Axios from '../../api/index'
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAuthContext } from '../../hooks/useAuthContext';
import useConversation from '../../zustand/useConversation';
const Index = () => {
	const [filter, setFilter] = useState("All")
	const { setTotalRespond, totalRespond } = useConversation()
	let friendList = useLoaderData()
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [state, dispatch] = useAuthContext()
	const [list, setList] = useState(friendList)
	const getListByFilter = async () => {
		let url = `/api/v1/friendships?user_id=eq:1&status=friends`
		try {
			if (filter === "All") {
				url = `/api/v1/friendships?user_id=eq:${JSON.parse(localStorage.getItem('user')).id}&status=friends`
			} else if (filter === "Respond") {
				url = `/api/v1/friendships?user_id=eq:${JSON.parse(localStorage.getItem('user')).id}&status=request_received`
			} else {
				url = `/api/v1/friendships?user_id=eq:${JSON.parse(localStorage.getItem('user')).id}&status=request_sent`
			}
			const res = await Axios.get(url)
			setLoading(true)
			if (res.status === 200) {
				if (filter == "Respond") {
					setTotalRespond(res.data.data.length)
				}
				setList(res.data.data)
				setSearch('')
				setTimeout(() => {
					setLoading(false)
				}, 1000) // Set the amount of time to show the loading animation (in milliseconds)
			}
		} catch (error) {
			toast.error(error.message)
		} finally {
			setTimeout(() => {
				setLoading(false)
			}, 1000)
		}
	}
	useEffect(() => {
		getListByFilter()
	}, [filter])
	useEffect(() => {
		if (search.length > 0) {
			const searchList = list.filter(friend => friend.friend.username.toLowerCase().includes(search.toLowerCase()))
			setList(searchList)
		}
		else {
			getListByFilter()
		}
	}, [search])
	// console.log(list)
	const sendReq = async (friendData) => {
		try {
			const userID = JSON.parse(localStorage.getItem('user')).id;
			const friendID = friendData.friend.id;
			if (friendData.status === 'not_friend') {
				const res = await Axios.post('/api/v1/friendships/request', { userID, friendID });
				if (res.status === 201) {
					// console.log(res);
					getListByFilter()
				}
			} else if (friendData.status === 'request_received') {
				const res = await Axios.post('/api/v1/friendships/accept', { userID, friendID });
				if (res.status === 200) {
					// console.log(res);
					getListByFilter()
				}
			} else if (friendData.status === 'request_sent') {
				const res = await Axios.delete('/api/v1/friendships/request', { data: { userID, friendID } });
				if (res.status === 204) {
					// console.log(res);
					getListByFilter()
				}
			} else {
				const res = await Axios.post('/api/v1/friendships/unfriend', { userID, friendID })
				if (res.status === 204) {
					console.log(res);
					getListByFilter()
				}
			}
		} catch (error) {
			console.error(error);
			;
		}
	};
	const cancelReq = async (friendData) => {
		try {
			const userID = state.user.id;
			const friendID = friendData.friend.id;
			if (friendData.status === 'request_received') {
				const res = await Axios.delete('/api/v1/friendships/accept', { data: { userID, friendID } });
				if (res.status === 204) {
					// console.log(res);
					getListByFilter()
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<div className='w-full h-full bg-white dark:bg-primary-dark p-3 rounded-xl overflow-hidden'>
			<div className="w-full h-full flex flex-col gap-10">
				<section className='w-full flex justify-between items-center'>
					<h1 className='font-bold text-2xl text-black dark:text-white'>Friends</h1>
					<div className="w-[345px] h-[50px]">
						<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className='bg-light-gray dark:bg-[#282930] dark:text-white dark:focus:outline-white rounded-md px-3 py-2 w-full focus:outline-primary' placeholder='Search by username' />
					</div>
				</section>
				<div className="w-full flex flex-col gap-2">
					<ul className="w-full flex gap-2">
						{
							[`All`, `Respond`, `Request`].map((item, index) => (
								<li key={index}>
									<button onClick={() => setFilter(item)} className={`w-[120px] h-[40px] text-base hover:bg-gray-200 hover:rounded-md transition-all text-black dark:text-white relative ${filter === item ? "border-b-2 border-primary font-medium text-primary dark:text-primary" : ""}`}>
										{item}
										{
											totalRespond > 0 && item === "Respond" && (
												<span className='absolute top-0 right-0 size-5 rounded-full bg-black text-white flex justify-center items-center text-sm p-1'>
													{item === "Respond" ? `${totalRespond}` : ''}
												</span>
											)
										}
									</button>
								</li>
							))
						}
					</ul>
					<div className="w-full h-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 overflow-y-scroll pr-3 pt-3">
						{
							!loading ? (
								list.map((friend, index) => (
									<FriendItem
										key={index} friend={friend}
										cancelReq={cancelReq}
										sendReq={sendReq}
										className={'border hover:border-[#666666] hover:shadow-lg hover:-translate-y-[2px] transition-all h-fit'} />
								))
							) : (
								Array.from({ length: list.length }, (_, index) => (
									<Skeleton key={index} width={342} height={282} borderRadius={8} />
								))
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
