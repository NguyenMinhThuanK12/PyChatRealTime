import React, { useState } from 'react'
import Messages from './Messages'
import MessageDetail from './MessageDetail'
import { useLoaderData } from 'react-router-dom'
import Axios from '../../api/index'
const MessageContainer = () => {
	const loader = useLoaderData()
	const [isDragging, setIsDragging] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState([]);
	const onDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
		e.dataTransfer.dropEffect = "copy";
	}
	const onDragLeave = (e) => {
		e.preventDefault();
		setIsDragging(false)
	};
	const onDrag = (e) => {
		e.preventDefault();
		setIsDragging(false)
		const files = e.dataTransfer.files;
		for (let i = 0; i < files.length; i++) {
			if (files[i].type.split('/')[0] !== 'image') {
				toast.error('Only images are allowed')
				continue;
			}
			if (!selectedFiles.some((e) => e.name == files[i].name)) {
				const reader = new FileReader();
				reader.readAsDataURL(files[i]);
				reader.onload = () => {
					setSelectedFiles((prev) => [...prev, reader.result]);
				};
			}
		}
	}
	return (
		<div className='w-full h-full flex flex-row gap-3'>
			<div className="w-full h-full flex flex-col gap-2 bg-white p-3 rounded-xl relative" onDrop={onDrag} onDragOver={onDragOver} onDragLeave={onDragLeave}>
				<Messages msgConversation={loader} selectedFiles={selectedFiles} />
				{
					isDragging && (
						<div className="absolute w-full h-full inset-0 bg-black/50 z-10 rounded-xl">
							<div className="w-full h-full flex justify-center items-center">
								<div className="w-full h-24 rounded-md flex justify-center items-center">
									<h1 className="text-white text-3xl">Drop files here</h1>
								</div>
							</div>
						</div>
					)
				}
			</div>
			<MessageDetail />
		</div>
	)
}

export const action = async ({ params }) => {
	const res = await Axios.get(`/api/v1/conversations/${params.conversationID}/messages?sort_by=-time`)
	if (res.status === 200) {
		return res.data.data
	}
}

export default MessageContainer