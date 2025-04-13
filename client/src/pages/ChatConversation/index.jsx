import React, { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
import NewConversation from '../NewConversation'
import useConversation from '../../zustand/useConversation';
import { useAuthContext } from '../../hooks/useAuthContext';
import Axios from '../../api/index'
import Conversations from '../../components/message/Conversations';

const Index = () => {

	const location = useLocation()
	const { selectedConversation, setConversations } = useConversation()
	const conversationsLoader = useLoaderData()
	const [query, setQuery] = useState('')
	const filteredConversations = conversationsLoader.filter(conversation =>
		conversation.friend.username.toLowerCase().includes(query.toLowerCase())
	);
	return (
		<div className='w-full h-full flex gap-3'>
			<div className="w-[320px] max-w-[400px] min-w-[320px] h-full bg-white dark:bg-primary-dark rounded-xl flex flex-col">
				<div className="w-full h-[120px] flex flex-col gap-3 p-3">
					<div className="w-full flex justify-between items-center gap-2">
						<span className='font-bold text-2xl dark:text-white'>Chat</span>
					</div>
					<div className="w-full flex gap-2">
						<input type="search" onChange={(e) => setQuery(e.target.value)} className='bg-light-gray dark:bg-[#282930] dark:text-white dark:focus:outline-white rounded-md px-3 py-2 w-full focus:outline-primary' placeholder='Search by name' />
					</div>
				</div>
				<Conversations conversationsUser={filteredConversations} />
			</div>
			{
				location.pathname.includes("to") ? <NewConversation /> :
					(
						<>
							<div className="w-full h-full rounded-xl flex flex-col">
								{
									selectedConversation == null ? (
										<NoChatSelected />
									) : (
										<Outlet />
									)
								}
							</div>
						</>
					)
			}
		</div>
	)
}

const NoChatSelected = () => {
	const [state, dispatch] = useAuthContext()
	return (
		<div className='flex items-center justify-center w-full h-full bg-white rounded-xl'>
			<div className='px-4 text-center sm:text-lg md:text-3xl text-black dark:text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {JSON.parse(localStorage.getItem("user"))?.username} ❄</p>
				<p>Select a chat to start messaging</p>
				{/* <TiMessages className='text-3xl md:text-6xl text-center' /> */}
			</div>
		</div>
	);
};

export const getChatBriefs = async ({ }) => {
	return (await Axios.get(`/api/v1/users/me/conversations`)).data.data
}

export default Index