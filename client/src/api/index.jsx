import axios from "axios"

export default axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}`,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json; charset=utf-8'
	},
	withCredentials: true,
})