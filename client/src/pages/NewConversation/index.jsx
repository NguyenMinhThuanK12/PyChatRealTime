import React from 'react'
import { Form, useLoaderData } from 'react-router-dom'

const Index = () => {

	const data = useLoaderData()

	return (
		<div className='w-full h-full rounded-xl bg-white dark:bg-primary-dark p-3'>
			<form className='w-full h-[50px] flex items-center gap-1 border-b border-black p-2'>
				<span>To:</span>
				<input type="text" className='w-full h-full focus:outline-none' />
			</form>
		</div>
	)
}

export default Index