import React, { useEffect, useState } from 'react'
import CustomizeInput from '../../components/input/CustomizeInput'
import SearchItem from '../../components/searchItem/SearchItem';
import useSearch from '../../hooks/useSearch';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Axios from '../../api/index'
const Index = () => {
	const [query, setQuery] = useState('')
	const [usersData, setUsersData] = useState([])
	const { loading, users, searchUsers } = useSearch({ query })
	const handleChange = (e) => {
		setQuery(e.target.value)
	}
	const sendReq = async (searchValue) => {
		try {
			const userID = JSON.parse(localStorage.getItem('user')).id;
			const friendID = searchValue.id;
			if (searchValue.status === 'not_friend') {
				const res = await Axios.post('/api/v1/friendships/request', { userID, friendID });
				if (res.status === 201) {
					// console.log(res);
					searchUsers()
				}
			} else if (searchValue.status === 'request_received') {
				const res = await Axios.post('/api/v1/friendships/accept', { userID, friendID });
				if (res.status === 200) {
					// console.log(res);
					searchUsers()
				}
			} else if (searchValue.status === 'request_sent') {
				const res = await Axios.delete('/api/v1/friendships/request', { data: { userID, friendID } });
				if (res.status === 204) {
					// console.log(res);
					searchUsers()
				}
			}
		} catch (error) {
			console.error(error);
			;
		}
	};
	const cancelReq = async (searchValue) => {
		try {
			const userID = JSON.parse(localStorage.getItem('user')).id;
			const friendID = searchValue.id;
			if (searchValue.status === 'request_received') {
				const res = await Axios.delete('/api/v1/friendships/accept', { data: { userID, friendID } });
				if (res.status === 204) {
					// console.log(res);
					searchUsers()
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		setUsersData(users);
	}, [users]);
	return (
		<div className='w-full h-full bg-white dark:bg-primary-dark rounded-xl p-3 flex flex-col gap-5'>
			<section>
				<h1 className='font-bold text-2xl dark:text-white'>Search</h1>
			</section>
			<div className="w-[345px] h-[50px]">
				<CustomizeInput placeholder={"Search by username or email"} onChange={handleChange} />
			</div>
			<div className="w-full h-full flex gap-3 overflow-hidden">
				{/* <section className='w-[320px] h-full border-r pr-3 flex flex-col'>
					<div className="w-full flex justify-between items-center">
						<h2 className='font-medium dark:text-white'>Recent search</h2>
						<button className='font-medium dark:text-white hover:underline'>
							Clear
						</button>
					</div>
					<div className="w-full h-full flex flex-col mt-4 overflow-y-scroll">
						{
							Array.from({ length: 20 }, (_, index) => (
								<div key={index} className="w-full flex justify-between items-center px-2 py-3 border-b hover:bg-light-gray dark:hover:bg-white/30 transition-all first:border-t">
									<span className='dark:text-white'>adam + {index}</span>
									<button>
										<PiX size={20} className='dark:text-white' />
									</button>
								</div>
							))
						}
					</div>
				</section> */}
				<section className='w-full h-full flex flex-col gap-3'>
					<div className="w-full flex justify-between items-center">
						<h2 className='font-medium dark:text-white'>Search result</h2>
					</div>
					<div className="w-full h-full overflow-y-scroll">
						<div className="w-full h-fit grid grid-cols-1 xl:grid-cols-3 gap-5 pr-2 pb-2">
							{
								loading ? (
									Array.from({ length: users.length }, (_, index) => (
										<div key={index} className="w-full h-fit p-5 bg-[#f0f0f0] dark:bg-[#3a3b3c] flex justify-between items-center rounded-lg shadow-md">
											<div className="w-full flex items-center gap-4">
												<Skeleton width={85} height={85} circle baseColor='#D8D9DA' />
												<div className="flex flex-col">
													<Skeleton count={1} width={200} baseColor='#D8D9DA' />
													<Skeleton count={1} baseColor='#D8D9DA' />
												</div>
											</div>
											<Skeleton width={100} height={40} baseColor='#D8D9DA' />
										</div>
									))
								) : (
									usersData.map((item, index) => (
										<SearchItem item={item} key={index} sendReq={sendReq} cancelReq={cancelReq} />
									))
								)
							}
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default Index