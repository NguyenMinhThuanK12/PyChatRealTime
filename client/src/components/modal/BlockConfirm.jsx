import React from 'react';
import Axios from '../../api/index'
import { toast } from 'react-toastify';
import useConversation from '../../zustand/useConversation';
const BlockConfirm = ({ user, handleVisibleBlockModal, type = 'block' }) => {

	const { setLoadingCheckBlock, setSelectedConversation,setLoadConversations } = useConversation()
	const confirmBlock = async () => {
		try {
			if (type == 'block') {
				const data = {
					"userID": JSON.parse(localStorage.getItem('user')).id,
					"friendID": user.friend.id
				}
				const res = await Axios.post(`/api/v1/friendships/block`, data)
				if (res.status === 200) {
					handleVisibleBlockModal('')
					toast.success("Blocked successfully")
					setLoadingCheckBlock([true, 'blocked'])
				}
			} else {
				const res = await Axios.delete(`/api/v1/conversations/${user.id}`)
				if (res.status == 204) {
					handleVisibleBlockModal('')
					setSelectedConversation(null)
					toast.success("Deleted successfully")
					setLoadConversations(true)
					setTimeout(() => {
						setLoadConversations(false)
					}, 500);
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			{/* Your modal */}
			<div className="fixed z-10 inset-0 overflow-y-auto">
				<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<div onClick={() => handleVisibleBlockModal('')} className="fixed inset-0 transition-opacity">
						<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
					{/* Modal content */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
					<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									{/* Icon */}
									<svg
										className="h-6 w-6 text-red-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 className="text-lg leading-6 font-medium text-gray-900 first-letter:uppercase">{type} {user.friend.username}?</h3>
									<div className="mt-2">
										<p className="text-sm leading-5 text-gray-500">
											Are you sure you want to {type} this user? This action cannot be undone.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
								<button
									onClick={() => confirmBlock()}
									type="button"
									className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
								>
									{type == 'block' ? 'Block' : 'Delete'}
								</button>
							</span>
							<span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
								<button
									onClick={() => handleVisibleBlockModal('')}
									type="button"
									className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-primary-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
								>
									Cancel
								</button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlockConfirm;