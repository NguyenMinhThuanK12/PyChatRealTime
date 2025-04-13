import React, { useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { PiUserListBold, PiGearSixBold, PiChatCenteredDotsBold, PiMagnifyingGlassBold, PiSignOutBold } from "react-icons/pi";
import IconMenu from '../../components/iconmenu/IconMenu';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/LogoIcon';
import Setting from '../../pages/Setting'
import { customToast } from '../../utils/customToast';
import Axios from '../../api/index'
import { useAuthContext } from '../../hooks/useAuthContext';
import useConversation from '../../zustand/useConversation';
const SideBar = () => {
	const [visibleSetting, setVisibleSetting] = useState(false)
	const { selectedConversation, setSelectedConversation, conversations } = useConversation()
	const [state, dispatch] = useAuthContext()
	const sideMenu = [
		{
			to: selectedConversation === null ? '/conversation' : `/conversation/${selectedConversation.id}`,
			title: "Chat",
			icon: PiChatCenteredDotsBold
		},
		{
			to: "/search",
			title: "Search",
			icon: PiMagnifyingGlassBold
		},
		{
			to: `/profile/${JSON.parse(localStorage.getItem('user')).id}`,
			title: "Profile",
			icon: FaRegUser
		},
		{
			to: "/friend_list",
			title: "Friends List",
			icon: PiUserListBold
		}
	]
	const navigate = useNavigate()
	const logoutUser = async () => {
		await Axios.post('/api/v1/logout').then(res => {
			if (res.status === 200) {
				localStorage.removeItem('user')
				localStorage.removeItem('auth')
				dispatch({ type: "LOGOUT" })
				customToast({ type: "success", message: "Log out success" })
			}
			navigate('/login')
		}).catch(err => {
			console.log(err)
		})
	};

	return (
		<>
			<div className='h-full w-20 bg-white rounded-xl dark:bg-primary-dark'>
				<div className="p-1.5 w-full h-full flex flex-col justify-between items-center">
					<section className="w-full h-full flex flex-col gap-6">
						<div className="w-[60px] h-[60px]">
							<LogoIcon />
						</div>
						<div className="w-full flex flex-col gap-5 justify-center items-center relative">
							{
								sideMenu.map((item, index) => (
									<IconMenu key={index} to={item.to} title={item.title} Icon={item.icon} onClick={item.onClick} />
								))
							}
							<div
								data-tooltip-id="my-tooltip"
								data-tooltip-content={"Setting"}
								data-tooltip-place="right"
								data-tooltip-offset={20}
								onClick={() => setVisibleSetting(!visibleSetting)}
								className={`w-[55px] h-[55px] flex justify-center items-center rounded-lg hover:bg-primary group transition-all`}>
								<PiGearSixBold size={29} className="group-hover:text-white dark:text-dark-gray cursor-pointer" />
							</div>
						</div>
					</section>
					<section className='w-full flex flex-col items-center gap-3'>
						<div
							onClick={() => {
								navigate(`/profile/${state.user.id ? state.user.id : JSON.parse(localStorage.getItem('user')).id}`)
							}}
							className="w-[55px] h-[55px] rounded-full overflow-hidden">
							<img
								className='w-full h-full object-cover'
								src={state.user?.avatar ? state.user.avatar : JSON.parse(localStorage.getItem('user')).avatar} alt="User Avatar" />
						</div>
						<Link
							onClick={logoutUser}
							className="w-[55px] h-[55px] flex justify-center items-center hover:bg-primary group rounded-xl transition-all">
							<PiSignOutBold size={29} className='group-hover:text-white dark:text-dark-gray' />
						</Link>
					</section>
				</div>
			</div>
			{visibleSetting && <Setting visibleSetting={visibleSetting} onClick={setVisibleSetting} />}
		</>
	)
}

export default SideBar