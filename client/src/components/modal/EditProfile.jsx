import React, { useState } from 'react';
import { PiX } from 'react-icons/pi';
import Axios from '../../api/index';
import { toast } from 'react-toastify';
const EditInfo = ({ setIsVisibleEditForm, user, setUser }) => {
	const [firstName, setFirstName] = useState(user.first_name)
	const [lastName, setLastName] = useState(user.last_name)
	const [userName, setUserName] = useState(user.username)
	const [email, setEmail] = useState(user.email)

	const handleChange = async () => {
		const formData = new FormData()
		formData.append('first_name', firstName)
		formData.append('last_name', lastName)
		formData.append('username', userName)
		formData.append('email', email)
		try {
			const res = await Axios.patch(`/api/v1/users/${user.id}`,formData)
			if (res.status === 200) {
				setUser(res.data.data)
				setIsVisibleEditForm(false)
				toast.success('Information updated successfully')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="fixed z-10 inset-0 overflow-y-auto">
			<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div onClick={() => setIsVisibleEditForm(false)} className="fixed inset-0 transition-opacity">
					<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				{/* Modal content */}
				<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="w-full flex flex-col">
							<div className="flex justify-between items-center border-b border-black pb-2">
								<div className="h-full flex gap-2 justify-start items-center">
									<button
										onClick={() => setIsVisibleEditForm(false)}
										type='button'
										className='h-full flex place-content-center rounded-full'>
										<PiX size={24} />
									</button>
									<p className='text-xl font-medium'>Edit Information</p>
								</div>
								<button onClick={() => handleChange()} className='w-fit h-fit px-6 py-2 rounded-md text-white bg-primary font-medium'>Save</button>
							</div>
							<div className="w-full flex flex-col gap-3 mt-4">
								<div className="w-full flex flex-col gap-2">
									<label htmlFor="firstName">First Name</label>
									<input type="text" name="firstName" id="firstName" onChange={(e) => setFirstName(e.target.value)} defaultValue={user.first_name} placeholder='Enter first name' className='w-full bg-gray-200 rounded-md p-3' />
								</div>
								<div className="w-full flex flex-col gap-2">
									<label htmlFor="lastName">Last Name</label>
									<input type="text" name="lastName" id="lastName" onChange={(e) => setLastName(e.target.value)} defaultValue={user.last_name} placeholder='Enter last name' className='w-full bg-gray-200 rounded-md p-3' />
								</div>
								<div className="w-full flex flex-col gap-2">
									<label htmlFor="userName">Username</label>
									<input type="text" name="userName" id="userName" onChange={(e) => setUserName(e.target.value)} defaultValue={user.username} placeholder='Enter username' className='w-full bg-gray-200 rounded-md p-3' />
								</div>
								<div className="w-full flex flex-col gap-2">
									<label htmlFor="email">Email</label>
									<input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} defaultValue={user.email} placeholder='Enter email' className='w-full bg-gray-200 rounded-md p-3' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

export default EditInfo;
