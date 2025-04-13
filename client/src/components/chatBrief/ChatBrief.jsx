import React, { useEffect, useState, useCallback } from 'react';
import Axios from '../../api/index';
import { useNavigate } from 'react-router-dom';
import useConversation from '../../zustand/useConversation';
import { formatMessageTime } from '../../utils/extractTIme'
import { useSocketContext } from '../../context/SocketContext';

const ChatBrief = ({ className = '', currentConversation }) => {
	const navigate = useNavigate();
	const [conversation, setConversation] = useState(currentConversation);
	const { setSelectedConversation, selectedConversation, setLoadingCheckBlock } = useConversation();
	const [loading, setLoading] = useState(false);
	const { socket } = useSocketContext();

	useEffect(() => {
		setConversation(currentConversation);
	}, [currentConversation]);

	const joinRoom = useCallback((conversationID) => {
		socket.emit('join', { channel_id: conversationID });
	}, [socket]);

	const leaveRoom = useCallback((conversationID) => {
		socket.emit('leave', { channel_id: conversationID });
	}, [socket]);

	const leaveRoomWithID = useCallback((conversation) => {
		if (conversation) {
			leaveRoom(conversation.id);
		}
	}, [leaveRoom]);
	const userSend = () => currentConversation.last_message.user_id === JSON.parse(localStorage.getItem('user')).id ? 'You: ' : '';

	const isUserSend = () => currentConversation.last_message.user_id === JSON.parse(localStorage.getItem('user')).id;

	const getFriendship = useCallback(async () => {
		setLoadingCheckBlock([true, '']);
		try {
			const userId = JSON.parse(localStorage.getItem('user')).id;
			const friendId = currentConversation.friend.id;
			const res = await Axios.get(`/api/v1/friendships?user_id=eq:${userId}&friend_id=eq:${friendId}`);
			if (res.status === 200) {
				setLoadingCheckBlock([false, res.data.data[0].status]);
			}
		} catch (error) {
			setLoadingCheckBlock([false, '']);
		}
	}, [currentConversation, setLoadingCheckBlock]);

	const isUserSeen = useCallback(() => {
		if (!conversation.seen_at) {
			const userId = JSON.parse(localStorage.getItem('user')).id;
			socket.emit("seen", {
				conversation_id: conversation.id,
				user_id: userId
			});
			setConversation(prev => ({ ...prev, seen_at: new Date() }));
		}
		setLoading(true);
		setTimeout(() => setLoading(false), 500);
	}, []);

	const handleConversationClick = () => {
		navigate(`/conversation/${conversation.id}`);
		leaveRoomWithID(selectedConversation);
		joinRoom(conversation.id);
		setSelectedConversation(conversation);
		getFriendship();
		isUserSeen();
	};

	const renderLastMessage = () => {
		const { last_message: lastMessage } = conversation;
		if (!lastMessage) return '';

		const isUser = isUserSend();
		const isDeleted = lastMessage?.deleted_messages.length !== 0;
		const isRevoked = lastMessage?.revoke_at !== null;
		const message = lastMessage.message;

		if (isRevoked) return 'Message has been revoked.';
		if (isDeleted) return 'Message has been deleted.';

		switch (lastMessage.type) {
			case 'text':
				return `${isUser ? userSend() : ''}${message}`;
			case 'image':
				const photoCount = lastMessage.attachments.length;
				return `${isUser ? 'You sent' : `${conversation.friend.username} sent`} ${photoCount > 1 ? `${photoCount} photos` : 'a photo'}.`;
			default:
				return '';
		}
	};
	return (
		<div
			onClick={handleConversationClick}
			className={`${className} w-full h-auto p-3 flex gap-2 border-b dark:border-ebony-clay hover:bg-light-gray dark:hover:bg-white/30 transition-all cursor-pointer`}
		>
			<div className="size-[60px] rounded-full relative">
				<img
					src={conversation.friend.avatar}
					alt=""
					className="w-full h-full object-cover object-center rounded-full"
				/>
				<div
					className={`size-4 border-[3px] border-white absolute bottom-0 right-0 rounded-full ${!conversation.friend.last_online ? "bg-primary-900" : "hidden"}`}
				/>
			</div>
			<div className="flex-1 h-full flex flex-col justify-center items-center">
				<div className="w-full flex justify-between items-center">
					<span className="font-medium font-inter dark:text-white">{conversation.friend.username}</span>
					<span className="text-sm text-[#8d8d8d]">
						{conversation.last_message && formatMessageTime(new Date(conversation.last_message.time))}
					</span>
				</div>
				<div className="w-full flex justify-between items-center gap-1">
					<p className="text-sm w-[200px] truncate text-[#8d8d8d]">
						{renderLastMessage()}
					</p>
					{!conversation.seen_at && (
						<span className='size-3 rounded-full bg-primary'></span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatBrief;
