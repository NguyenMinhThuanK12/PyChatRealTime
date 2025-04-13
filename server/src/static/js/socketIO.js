//read file .env




// const host = process.env.HOST || 'localhost';
document.addEventListener('DOMContentLoaded', function () {
	const channelMatch = window.location.pathname.match(/^\/r\/\d+\/\d+$/);
	if (!channelMatch) {
		console.error('Invalid URL format. Expected /r/number');
		return;
	}
	const channel_id = channelMatch[0].split('/')[2];
	const user_send_id = channelMatch[0].split('/')[3];
	const socket = io('http://127.0.0.1:5000', {
		query: {
			userID: user_send_id
		}
	});
	socket.emit('join', { channel_id: channel_id });

	const sendButton = document.querySelector('#sendButton')
	sendButton?.addEventListener('click', function () {
		const messageInput = document.querySelector('#messageInput');
		const message = messageInput.value.trim();
		if (message !== '') {
			socket.emit('message',
				{
					user_id: user_send_id,
					channel_id,
					message,
					time: Date.now(),
					type: 'text'
				});
			messageInput.value = '';
		}
	});
	const uploadButton = document.querySelector('#uploadButton')
	uploadButton?.addEventListener('click', function () {
		const imageInput = document.querySelector('#imageInput');
		const file = imageInput.files[0];
		if (file) {
			//cover image to base64
			const reader = new FileReader();
			reader.onload = function (event) {
				const imageData = event.target.result;
				socket.emit('message', {
					user_id: user_send_id,
					channel_id,
					imageDatas: [{
						image: imageData.split(',')[1],
						fileExtension: file.name.split('.').pop()
					}
					],
					time: Date.now(),
					type: 'image',
				});
			};
			reader.readAsDataURL(file);
		}
	})
	const seenButton = document.querySelector('#seenButton')
	seenButton?.addEventListener('click', function () {
		socket.emit('seen', { conversation_id: channel_id, user_id: user_send_id });
	})
	socket.on('message', function (data) {
		if (data.type == 'text') {
			if (data.user_id == user_send_id)
				messageContainer.appendChild(createMessDiv(data.message, 'end'));
			else
				messageContainer.appendChild(createMessDiv(data.message, 'start'));
		}
		else if (data.type == 'image') {
			if (data.user_id == user_send_id)
				messageContainer.appendChild(createImageDiv(data.attachments[0].url, 'end'));
			else
				messageContainer.appendChild(createImageDiv(data.attachments[0].url, 'start'));
		}
	});
	socket.on('new_conversation_coming', function (data) {
		console.log(data)
		// if (data.conversation.id != channel_id && data.conversation.last_message.user_id != user_send_id)
		// 	createToast(null, data.conversation.last_message.message, 'room: ' + data.conversation.id, 'fa-solid fa-message')
	})

});
const createMessDiv = (message, location) => {
	const outerDiv = document.createElement('div');
	outerDiv.classList.add('d-flex', `justify-content-${location}`, 'mt-1');

	const innerDiv = document.createElement('div');
	innerDiv.classList.add('bg-primary', 'text-white', 'p-2', 'rounded');
	innerDiv.textContent = message;
	outerDiv.appendChild(innerDiv);
	return outerDiv
}

const createImageDiv = (url, location) => {
	const outerDiv = document.createElement('div');
	outerDiv.classList.add('d-flex', `justify-content-${location}`, 'mt-1');

	const innerDiv = document.createElement('div');
	innerDiv.classList.add('bg-primary', 'text-white', 'p-2', 'rounded');
	const image = document.createElement('img');
	image.src = url;
	image.style.width = '200px';
	innerDiv.appendChild(image);
	outerDiv.appendChild(innerDiv);
	return outerDiv
}
