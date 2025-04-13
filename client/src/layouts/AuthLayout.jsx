import React from 'react'
import { Outlet, redirect } from 'react-router-dom'
import { LoginImg } from '../assets'
import Axios from '../api/index'
import { customToast } from "../utils/customToast";

const AuthLayout = () => {

	return (
		<div className='text-black w-full h-screen bg-[#efeff1]'>
			<div className="w-full h-full flex justify-center items-center p-[2%] md:p-[5%] lg:p-[10%]">
				<div className="w-[1100px] h-[760px] bg-white rounded-2xl flex overflow-hidden shadow-lg">
					<div className="w-full lg:w-1/2 h-full">
						<Outlet />
					</div>
					<div className="hidden lg:block w-1/2 h-full">
						<img src={LoginImg} alt="" className='w-full h-full object-cover' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthLayout

export const action = (setLoggedInUser) => async ({ request }) => {
	const data = await request.formData();
	const action = request.url.includes("login") ? "login" : "signup"
	let userInformaiton = {}
	if (action === "login") {
		userInformaiton.email = data.get("email")
		userInformaiton.password = data.get("password")
	} else {
		// remove all white space from aa string
		userInformaiton.firstName = data.get("firstName").replace(/\s/g, '');
		userInformaiton.lastName = data.get("lastName").replace(/\s/g, '');
		userInformaiton.email = data.get("email")
		userInformaiton.password = data.get("password")
		if (data.get("password") !== data.get("confirmPassword")) {
			return {
				invalidPassword: "Password does not match"
			}
		}
		if (userInformaiton.firstName.trim() === "") {
			return {
				emptyField: "This field is required"
			}
		}
		if (userInformaiton.lastName.trim() === "") {
			return {
				emptyField: "This field is required"
			}
		}
	}
	let response
	try {
		if (action === 'login') {
			response = await Axios.post("/api/v1/login", userInformaiton)
		} else {
			response = await Axios.post("/api/v1/register", userInformaiton)
		}
		if (response.status == 200) {
			setLoggedInUser(response)
			localStorage.setItem("user", JSON.stringify(response.data.data))
			localStorage.setItem("auth", true)
			customToast({ type: "success", message: action === 'login' ? "Login successfully" : "Sign up successfully" })
			return window.location.href = "/conversation"
			// return redirect("/conversation")
		}
	} catch (error) {
		console.log(error)
		if (error.response.data.message.includes("Invalid")) {
			return {
				invalidEmailOrPassword: error.response.data.message,
			}
		}
		return {
			emailExist: error.response.data.message
		}
	}
}