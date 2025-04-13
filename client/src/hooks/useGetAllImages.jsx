import React, { useEffect, useState } from 'react'
import Axios from '../api/index'
import useConversation from '../zustand/useConversation'
const useGetAllImages = () => {
	const { selectedConversation } = useConversation()
	const [imagesData, setImagesData] = useState([])
	const [loadingImg, setLoadingImg] = useState(false)
	const getAllImages = async () => {
		setLoadingImg(true)
		try {
			const res = await Axios.get(`/api/v1/conversations/${selectedConversation.id}/images?sort_by=-time`)
			if (res.status == 200) {
				setImagesData(res.data.data)
				// setLoadingImg(false)
			}
		} catch (error) {
			console.log(error)
			setLoadingImg(false)
		} finally {
		}
	}
	useEffect(() => {
		if (selectedConversation?.id) getAllImages();
	}, [])

	return { imagesData, getAllImages, loadingImg };
}

export default useGetAllImages