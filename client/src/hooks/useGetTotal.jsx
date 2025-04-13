import React, { useEffect, useState } from 'react'
import Axios from '../api/index'
import { useAuthContext } from './useAuthContext'
import useConversation from '../zustand/useConversation'
const useGetTotal = () => {
	const [state, dispatch] = useAuthContext()
	const { setTotalRespond, totalRespond } = useConversation()
	const [total, setTotal] = useState(0)
	const getTotal = async () => {
		try {
			const res = await Axios.get(`/api/v1/friendships?user_id=eq:${JSON.parse(localStorage.getItem('user')).id}&status=request_received`)
			if (res.status === 200) {
				setTotal(res.data.data.length)
				setTotalRespond(res.data.data.length)
			}
			// Add your code here
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		getTotal()
	}, [])
	return {
		total
	}
}

export default useGetTotal