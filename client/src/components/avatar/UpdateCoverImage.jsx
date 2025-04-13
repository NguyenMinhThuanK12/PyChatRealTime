import React, { useState, useCallback } from 'react'
import { ImSpinner9 } from 'react-icons/im'
import Axios from '../../api/index'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'
import { dataURLtoFile } from '../../utils/dataURLtoFile'
import { getCroppedImg } from '../../utils/getCropImage'
const UpdateCoverImage = ({ file, setSelectedCoverFile }) => {

	const [isLoading, setIsLoading] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedImage, setCroppedImage] = useState(null);
	const onCropComplete = useCallback((_, croppedAreaPixels) => {
		const cropImage = getCroppedImg(file, croppedAreaPixels, 4 / 3);
		setCroppedImage(cropImage);
	}, []);
	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true); // Add this line to set isLoading to true
		const fd = new FormData();
		fd.append('background', dataURLtoFile(croppedImage, "background.png"))
		try {
			const config = {
				headers: {
					'content-type': 'multipart/form-data',
				},
			};
			const res = await Axios.patch('/api/v1/users/me/background', fd, config)
			if (res.status === 200) {
				localStorage.setItem('user', JSON.stringify(res.data.data))
				toast.success("Update Cover Photo Success")
				setSelectedCoverFile(null)
			}
		} catch (err) {
			console.log(err)
			toast.error("Update Cover Photo Failed")
		} finally {
			setIsLoading(false); // Add this line to set isLoading to false
		}
	}
	return (
		<>
			<section className='fixed inset-0 m-auto w-[600px] h-fit bg-white rounded-lg z-20'>
				<div className="w-full h-full flex flex-col">
					<p className='text-base text-center font-semibold py-2 border-b'>Update Cover Photo</p>
					{
						isLoading &&
						<div className="w-full h-full absolute left-0 top-0 bg-white/80 flex justify-center items-center z-10">
							<ImSpinner9 className='animate-spin duration-500 text-primary-main' size={50} />
						</div>
					}
					<form
						onSubmit={(e) => onSubmit(e)}
						className='pt-2'>
						<p className='ml-4'>Preview Image:</p>
						<div className="p-2 overflow-hidden flex justify-center items-center w-full h-[400px] relative">
							<Cropper
								image={file}
								crop={crop}
								zoom={zoom}
								cropShape='rect'
								onCropChange={setCrop}
								showGrid={false}
								aspect={2}
								onCropComplete={onCropComplete}
								onZoomChange={setZoom}
							/>
						</div>
						<div className="w-full flex justify-end mt-3 border-t py-4 px-2">
							<button onClick={() => setSelectedCoverFile(null)} className='w-24 p-2 text-primary-main font-medium'>Cancel</button>
							<button type='submit' className='w-24 p-2 bg-primary text-white font-medium rounded-md'>Save</button>
						</div>
					</form>
				</div>
			</section>
			<div className="fixed inset-0 m-auto w-screen h-screen bg-black/40 z-10"></div>
		</>
	)
}

export default UpdateCoverImage