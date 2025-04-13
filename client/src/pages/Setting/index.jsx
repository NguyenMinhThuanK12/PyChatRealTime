import React, { useEffect, useState } from 'react'
import Overlay from '../../components/overlay'
import PropTypes from 'prop-types'
import Toggle from '../../components/toggle'
import { PiMinusCircle, PiArrowCircleRight, PiMagnifyingGlass } from "react-icons/pi";
import Axios from '../../api/index'
import useConversation from '../../zustand/useConversation';
import { toast } from 'react-toastify';
const Index = ({ onClick }) => {

	const [visibleBlockList, setVisibleBlockList] = useState(false)
	const [blockList, setBlockList] = useState([])
	const [query, setQuery] = useState('')
	const { loadingCheckBlock,setLoadingCheckBlock } = useConversation();
	const getBlockList = async () => {
		try {
			const res = await Axios.get(`/api/v1/friendships?user_id=${JSON.parse(localStorage.getItem('user')).id}&status=blocked`)
			if (res.status === 200) {
				setBlockList(res.data.data)
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		getBlockList()
	},[])
	useEffect(() => {
		if(query.length > 0){
			const searchList = blockList.filter(friend => friend.friend.username.toLowerCase().includes(query.toLowerCase()))
			setBlockList(searchList)
		}
		else{
			getBlockList()
		}
	},[query])
	const handelUnblock = async (friendID) => {
		try {
			const userID = JSON.parse(localStorage.getItem('user')).id;
			const res = await Axios.delete('/api/v1/friendships/block', { data: { userID, friendID } });
			console.log(res)
			if (res.status === 204) {
				toast.success('Unblocked successfully')
				getBlockList()
				setLoadingCheckBlock([true, ''])
			}
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<Overlay onClick={onClick} isVisibleBlockList={visibleBlockList} setVisibleBlockList={setVisibleBlockList}>
			<>
				<div className='w-[500px] h-[560px] flex flex-col items-center gap-8'>
					{
						!visibleBlockList ? (
							<>
								<h1 className='text-2xl font-bold dark:text-white'>Setting</h1>
								<div className="w-full h-fit flex flex-col items-center gap-3">
									<div className="size-32 rounded-full overflow-hidden">
										<img src={JSON.parse(localStorage.getItem('user')).avatar} alt="Avatar user" className='w-full h-full object-cover object-center' />
									</div>
									<span className='text-lg font-semibold dark:text-white'>{JSON.parse(localStorage.getItem('user')).username}</span>
								</div>
								<div className="w-full h-fit flex flex-col gap-2">
									<div className="w-full flex justify-between items-center border-y p-2">
										<span className='font-medium dark:text-white'>Dark mode</span>
										<Toggle></Toggle>
									</div>
									<div onClick={() => setVisibleBlockList(!visibleBlockList)} className="w-full flex justify-between items-center p-2 rounded-md hover:bg-light-gray dark:hover:bg-white/30 transition-all cursor-pointer">
										<div className="w-full flex items-center gap-2">
											<PiMinusCircle size={22} className='dark:text-white' />
											<span className='font-medium dark:text-white'>Manage blocking</span>
										</div>
										<PiArrowCircleRight size={28} className='dark:text-white' />
									</div>
								</div>
							</>
						) : (
							<>
								{/* <div className="w-full flex flex-col gap-8 items-center relative"> */}
								<div className="w-full h-full flex flex-col gap-6 items-center">
									<h1 className='text-2xl font-bold dark:text-white'>Manage blocking list</h1>
									<div className="w-full h-fit flex flex-col">
										<div className="w-full flex gap-2 px-2 py-3 border rounded-md">
											<PiMagnifyingGlass size={25} />
											<label className='w-full' htmlFor="searchBlockList">
												<input type="text" onChange={(e)=>setQuery(e.target.value)} placeholder='Search by usernamename' name='searchBlockList' className='w-full focus:outline-none text-base' />
											</label>
										</div>
										<span className="absolute w-[550px] h-px bg-black -left-6 -bottom-3"></span>
									</div>
									{/* </div> */}
									<div className="w-full h-full overflow-y-scroll flex flex-col gap-1 border-t pt-1">
										{/* /create an array with 10 elements each item has avatar circle and username and a button to block or unblock base on the data */}
										{blockList.map((user, index) => (
											<div key={index} className="w-full flex justify-between items-center">
												<div className="w-full flex items-center gap-2">
													<div className="size-16 rounded-full overflow-hidden">
														<img src={user.friend.avatar} alt="Avatar user" className='w-full h-full object-cover object-center' />
													</div>
													<span className='font-medium dark:text-white'>{user.friend.username}</span>
												</div>
												<button onClick={() => handelUnblock(user.friend.id)} className='w-fit h-fit py-2 px-3 rounded-md flex items-center justify-center bg-primary font-medium text-white'>Unblock</button>
											</div>
										))}

									</div>
								</div>
							</>
						)
					}
				</div>
			</>
		</Overlay>
	)
}

Index.propTypes = {
	onClick: PropTypes.func,
}

export default Index