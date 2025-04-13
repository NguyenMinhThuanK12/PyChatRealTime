import React, { useEffect, useMemo, useRef, useState } from 'react'
import Message from './Message'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from '../../context/SocketContext'
import MessageInput from './MessageInput';
import Axios from '../../api/index'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const Messages = ({ msgConversation, selectedFiles }) => {
	const [messages, setMessages] = useState([]);
	const { socket } = useSocketContext();
	const { selectedConversation, loadingCheckBlock, setLoadingCheckBlock, loadConversation } = useConversation();
	const [activeEleType, setActiveEleType] = useState(null);
	const messageEnd = useRef();
	const params = useParams()
	useEffect(() => {
		setMessages(msgConversation);
		setTimeout(() => {
			scrollToBottom();
		}, 200);
	}, [msgConversation]);

	useEffect(() => {
		const handleNewMessage = (data) => {
			setMessages(oldMsg => [data, ...oldMsg]);
			scrollToBottom(); // Scroll to bottom after updating messages
		};
		socket.on('message', handleNewMessage);
		return () => {
			socket.off('message', handleNewMessage);
		};
	}, [loadConversation]);
	const scrollToBottom = () => {
		messageEnd.current.scrollIntoView({ behavior: "smooth" });
	};
	const reloadMessage = async () => {
		const res = await Axios.get(`/api/v1/conversations/${params.conversationID}/messages?sort_by=-time`)
		if (res.status === 200) {
			setMessages(res.data.data)
		}
	}
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handelUnblock = async () => {
		try {
			const userID = JSON.parse(localStorage.getItem('user')).id;
			const friendID = selectedConversation.friend.id

			const res = await Axios.delete('/api/v1/friendships/block', { data: { userID, friendID } });
			console.log(res)
			if (res.status === 204) {
				toast.success('Unblocked successfully')
				setLoadingCheckBlock([false, ''])
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<div className='w-full h-full overflow-hidden flex flex-col gap-2 relative first:!mt-auto'>
				<h1 className='w-full absolute pb-2 z-10 text-lg dark:text-white dark:border-ebony-clay h-fit bg-light-gray p-2 rounded-md font-medium shadow-md'>{selectedConversation.friend.username}</h1>
				<div className="w-full h-full pt-12">
					<div className="w-full h-full overflow-y-auto flex flex-col-reverse">
						<div className='messageEnd' style={{ float: "left", clear: "both" }} ref={messageEnd}></div> {/* This empty div will always be at the end of your messages list */}
						{messages.map((item, index) => (
							<Message message={item} key={index} reloadMessage={reloadMessage} eleType={index} setActiveEleType={setActiveEleType} activeEleType={activeEleType} />
						))}
					</div>
				</div>
			</div>
			{
				loadingCheckBlock[1] == 'blocked' || loadingCheckBlock[1] == 'be_blocked' ? (
					<div className='w-full h-fit flex flex-col justify-center items-center gap-2 border-t py-2'>
						{
							loadingCheckBlock[1] == 'blocked' ? (
								<div className="w-full h-full flex flex-col gap-3 justify-end p-2 absolute top-0 rounded-md bg-black/80 items-center z-20">
									<span className='text-white font-medium'>You have blocked this user</span>
									<button onClick={handelUnblock} className='w-full h-fit text-center bg-primary rounded-md p-2 font-medium text-white hover:opacity-75 transition-opacity'>Unblock</button>
								</div>
							) : (
								<div className="w-full h-full flex flex-col gap-3 justify-center p-2 absolute top-0 rounded-md bg-black/80 items-center z-20">
									<span className='text-white font-medium inline-block pt-2'>This user has blocked you</span>
								</div>
							)
						}
					</div>
				) : (
					<MessageInput scroll={messageEnd} selectedImageFiles={selectedFiles} />
				)
			}
		</>
	);
};

export default Messages