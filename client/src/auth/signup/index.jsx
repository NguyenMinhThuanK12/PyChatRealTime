import React, { useState } from 'react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import SocialMediaButton from '../../components/button/SocialMediaButton'
import { Link, Form, useNavigation, useActionData, redirect } from 'react-router-dom'
import { PiEye, PiEyeClosed } from "react-icons/pi";
const Index = () => {
	const [isVisiblePassword, setIsVisiblePassword] = useState(false)
	const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false)
	const data = useActionData()
	const navigate = useNavigation()
	let isSigningup = navigate.formData?.get("email") != null && navigate.formData?.get("password") != null && navigate.formData?.get("firstName") && navigate.formData?.get("lastName")
	const logWithApp = [
		{
			name: "Google",
			icon: FcGoogle,
		},
		{
			name: "Facebook",
			icon: FaFacebook,
			color: "#0866ff"
		},
		{
			name: "Instagram",
			icon: FaInstagram,
			color: "#ff3d43"
		}
	]
	return (
		<div className="w-full md:px-10 md:py-10 px-10 py-5 h-full">
			<header className="w-full flex flex-col justify-center items-center gap-px">
				<h1 className="text-5xl font-oleo-script-regular">
					Are you new here?
				</h1>
				<h4 className='text-sm'>Be part of something great, join us!</h4>
			</header>
			<main className='mt-4 md:mt-8'>
				<Form className='space-y-3' method='POST'>
					<div className="w-full flex justify-between gap-4">
						<div className='w-full relative'>
							<label htmlFor="firstName" className="block font-medium leading-6 text-gray-900"><span className='text-red-400'>*</span>First Name</label>
							<div className="mt-2">
								<input
									id="firstName"
									name="firstName" placeholder='Enter your first name'
									type="text"
									autoComplete="firstName" required
									className="block w-full rounded-md p-3 border focus:outline-primary" />
							</div>
							{
								data && data.emptyField && (
									<p className='text-[12px] text-red-500 absolute top-1 right-0'>
										*{data.emptyField}
									</p>
								)
							}
						</div>
						<span className='w-px bg-gray-400 py-1'></span>
						<div className='w-full relative'>
							<label htmlFor="lastName" className="block font-medium leading-6 text-gray-900"><span className='text-red-400'>*</span>Last Name</label>
							<div className="mt-2">
								<input
									id="lastName"
									name="lastName" placeholder='Enter your last name'
									type="text"
									autoComplete="lastName" required
									className="block w-full rounded-md p-3 border focus:outline-primary" />
							</div>
							{
								data && data.emptyField && (
									<p className='text-[12px] text-red-500 absolute top-1 right-0'>
										*{data.emptyField}
									</p>
								)
							}
						</div>
					</div>
					<div className='relative'>
						<label htmlFor="email" className="block font-medium leading-6 text-gray-900"><span className='text-red-400'>*</span>Email</label>
						<div className="mt-2">
							<input
								id="email"
								name="email" placeholder='Enter your email'
								type="email"
								autoComplete="email" required
								className="block w-full rounded-md p-3 border focus:outline-primary" />
						</div>
						{
							data && data.emailExist && (
								<p className='text-[12px] text-red-500 absolute top-1 right-0'>
									*{data.emailExist}
								</p>
							)
						}
					</div>
					<div className='relative'>
						<label htmlFor="password" className="block font-medium leading-6 text-gray-900"><span className='text-red-400'>*</span>Password</label>
						<div className="mt-2 relative">
							<input
								id="password"
								name="password" placeholder='Enter your password'
								type={!isVisiblePassword ? 'password' : 'text'}
								autoComplete="password" required
								className="block w-full rounded-md p-3 border focus:outline-primary" />
							<span
								onClick={() => setIsVisiblePassword(!isVisiblePassword)}
								className='block absolute top-[28%] right-4'>
								{
									!isVisiblePassword ? <PiEye size={25} /> : <PiEyeClosed size={25} />
								}
							</span>
						</div>
						{
							data && data.invalidPassword && (
								<p className='text-[12px] text-red-500 absolute top-1 right-0'>
									*{data.invalidPassword}
								</p>
							)
						}
					</div>
					<div className='relative'>
						<label htmlFor="confirmPassword" className="block font-medium leading-6 text-gray-900"><span className='text-red-400'>*</span>Confirm Password</label>
						<div className="mt-2 relative">
							<input
								id="confirmPassword"
								name="confirmPassword" placeholder='Confirm your password'
								type={!isVisibleConfirmPassword ? 'password' : 'text'}
								autoComplete="password" required
								className="block w-full rounded-md p-3 border focus:outline-primary" />
							<span
								onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
								className='block absolute top-[28%] right-4'>
								{
									!isVisibleConfirmPassword ? <PiEye size={25} /> : <PiEyeClosed size={25} />
								}
							</span>
						</div>
						{
							data && data.invalidConfirmPassword && (
								<p className='text-[12px] text-red-500 absolute top-1 right-0'>
									*{data.invalidConfirmPassword}
								</p>
							)
						}
					</div>
					<button className='w-full border border-primary py-3 rounded-lg bg-primary transition-all hover:bg-transparent group block' type="submit">
						<span className='font-medium text-white group-hover:text-primary'>
							{
								isSigningup ? "Signing up..." : "Sign up"
							}
						</span>
					</button>
				</Form>
				<div className="space-y-3 md:space-y-3 mt-3">
					<div className="w-full flex justify-center items-center">
						<span className='h-px w-full bg-gray-400'></span>
						<span className='w-72 text-center text-base'>Or sign up with</span>
						<span className='h-px w-full bg-gray-400'></span>
					</div>
					<div className="w-full flex justify-between flex-col md:flex-row lg:gap-0 gap-3">
						{
							logWithApp.map((item, index) => (
								<SocialMediaButton key={index} name={item.name} Icon={item.icon} color={item.color} />
							))
						}
					</div>
				</div>
			</main>
			<footer className='w-full text-center mt-3 font-medium'>
				<p>
					Don't have account?
					<Link to={"/login"}>
						<span className='text-primary hover:underline'> Login now</span>
					</Link>
				</p>
			</footer>
		</div>
	)
}

export default Index
