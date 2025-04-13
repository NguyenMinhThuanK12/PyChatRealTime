import React, { useEffect, useState } from 'react'
import InformationLine from '../../components/generalInfomationLine/InformationLine'
import { MdCameraEnhance, MdPhotoCamera } from 'react-icons/md'
import { PiPhone, PiEnvelopeSimple } from "react-icons/pi";
import FriendItem from '../../components/friendItem/FriendItem';
import Axios from '../../api/index'
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import UpdateAvatar from '../../components/avatar/UpdateAvatar';
import { useAuthContext } from '../../hooks/useAuthContext';
import UpdateCoverImage from '../../components/avatar/UpdateCoverImage';
import { toast } from 'react-toastify';
import EditInfo from '../../components/modal/EditProfile';
const Index = () => {
	const data = useLoaderData()
	const [user, setUser] = useState(data)
	const params = useParams()
	const [friends, setFriends] = useState([])
	const [selectedFile, setSelectedFile] = useState(null)
	const [selectedCoverFile, setSelectedCoverFile] = useState(null)
	const [isVisibleEditForm, setIsVisibleEditForm] = useState(false)
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && !file.type.startsWith('image/')) {
			toast.error('Please select a valid image file.');
			return;
		}
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedFile(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const handleCoverFileChange = (e) => {
		const file = e.target.files[0];
		if (file && !file.type.startsWith('image/')) {
			toast.error('Please select a valid image file.');
			return;
		}
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedCoverFile(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const getUser = async () => {
		try {
			await Axios.get(`api/v1/users/${params.id}`).then((res) => {
				if (res.status === 200) {
					setUser(res.data.data)
				} else {
					toast.error(res.data.message)
				}
			})
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		}
	}
	useEffect(() => {
		const getFriends = async () => {
			try {
				await Axios.get(`api/v1/friendships?user_id=eq:${params.id}&status=friends`).then((res) => {
					if (res.status === 200) {
						setFriends(res.data.data)
						// console.log(res)
					}
				})
			} catch (error) {
				console.log(error)
			}
		}
		getFriends()
	}, [params.id])
	useEffect(() => {
		getUser()
	}, [selectedFile, selectedCoverFile, params.id])
	return (
		<div className='w-full h-full rounded-xl bg-white dark:bg-primary-dark p-3 overflow-hidden'>
			<div className="w-full h-full flex flex-col gap-2">
				<div className="w-full h-[350px] relative">
					<div id='coverImage' className="w-full h-[250px] rounded-xl relative">
						<img src={user.background} alt="cover image" className='w-full h-full object-cover object-center rounded-xl' />
						{
							(JSON.parse(localStorage.getItem('user')).id === user.id) && (
								<label htmlFor='coverImageFile' className="w-fit flex items-center gap-1 p-3 bg-black/30 rounded-md absolute top-[75%] right-2 transition-all hover:bg-black/60 cursor-pointer">
									<input type="file" name='' id='coverImageFile' onChange={handleCoverFileChange} accept="image/*" className='absolute w-full h-full inset-0 hidden' />
									<MdCameraEnhance size={28} className='text-white' />
									<span className='font-medium text-white'>Edit cover photo</span>
								</label>
							)
						}
					</div>
					<div className="w-full h-[100px] absolute bottom-8">
						<div className="w-full h-full flex justify-between items-center px-10">
							<section className="h-full flex gap-4 items-center">
								<div className="size-32 rounded-full border-[5px] border-gray-100 relative">
									<img src={user.avatar} alt="" className='w-full h-full object-cover rounded-full' />
									{
										(JSON.parse(localStorage.getItem('user')).id === user.id) && (
											<label htmlFor="imageFile" className='absolute top-3/4 right-0 z-10 overflow-hidden cursor-pointer'>
												<input type="file" name="" id="imageFile" className='hidden absolute w-full h-full' onChange={handleFileChange} accept="image/*" />
												<MdPhotoCamera size={40} className=' bg-gray-300 text-black p-2 rounded-full hover:bg-gray-400 transition-all hover:text-white' />
											</label>
										)
									}
								</div>
								<div className="w-fit h-full flex flex-col place-content-end pb-4">
									<span className='whitespace-nowrap text-xl font-bold dark:text-white'>{user.username}</span>
									<span className='whitespace-nowrap dark:text-white'>{user.email}</span>
								</div>
							</section>
							{
								JSON.parse(localStorage.getItem('user')).id == params.id && (
									<section className='h-full flex flex-col place-content-end pb-5'>
										<button onClick={() => setIsVisibleEditForm(!isVisibleEditForm)} className='w-fit h-fit px-10 py-2 border dark:border-white dark:text-white dark:hover:border-primary border-black rounded-md hover:bg-primary hover:border-primary transition-all hover:text-white'>Edit</button>
									</section>
								)
							}
						</div>
					</div>
				</div>
				<div className="w-full h-full flex flex-1 gap-3 overflow-hidden">
					<section className="w-[550px] h-full flex flex-col gap-3">
						<div className="w-full h-fit border border-[#c2c2c2] rounded-xl px-5 py-4">
							<div className="w-full h-full flex flex-col gap-1 border-r border-[#c2c2c2]">
								<h1 className='text-4xl font-bold dark:text-white'>{friends.length}</h1>
								<span className=' dark:text-white'>Friends</span>
							</div>
						</div>
						<div className="w-full h-full border border-[#c2c2c2] rounded-xl">
							<div className="w-full h-full px-5 py-2 flex flex-col gap-2">
								<h1 className='font-bold text-lg block py-2 dark:text-white'>General Information</h1>
								<div className="w-full h-full flex flex-col">
									{
										data && (
											<>
												<InformationLine title={"First name"} value={user.first_name} />
												<InformationLine title={"Last name"} value={user.last_name} />
												<InformationLine title={"Email"} value={user.email} />
											</>
										)
									}
								</div>
							</div>
						</div>
					</section>
					<section className='w-full h-f border border-[#c2c2c2] rounded-xl flex p-4'>
						<div className="w-full h-full flex flex-col gap-3 overflow-hidden relative group">
							<h1 className='w-full h-fit py-1 block font-bold text-lg dark:text-white'>Friends</h1>
							<div className="w-full h-full flex flex-wrap gap-4 border border-[#c2c2c2] rounded-lg overflow-y-scroll">
								{
									friends.map((item, index) => (
										<FriendItem key={index} friend={item} className={'w-fit h-fit'} />
									))
								}
							</div>
							{
								JSON.parse(localStorage.getItem('user')).id == params.id && (
									<Link to={"/friend_list"} className='absolute w-fit px-6 py-3 bg-primary text-white font-bold -bottom-16 right-9 rounded-md group-hover:bottom-7 transition-all duration-300 hover:opacity-60'>
										View All
									</Link>
								)
							}
						</div>
					</section>
				</div>
			</div>
			{
				selectedFile != null && <UpdateAvatar file={selectedFile} setSelectedFile={setSelectedFile} />
			}
			{
				selectedCoverFile != null && <UpdateCoverImage file={selectedCoverFile} setSelectedCoverFile={setSelectedCoverFile} />
			}
			{
				isVisibleEditForm && (
					<EditInfo setIsVisibleEditForm={setIsVisibleEditForm} user={user} setUser={setUser} />
				)
			}
		</div>
	)
}

export default Index