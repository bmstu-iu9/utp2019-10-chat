const req = new XMLHttpRequest()
			
			req.open('GET', '/req/curuser.js', true)
			req.onreadystatechange = () => {
				if (req.readyState != 4) return;
				const curUser = JSON.parse(req.responseText).user
				userdata.textContent += curUser
				
	  			const socket = io()
	  			
	  			socket.on('connect', () => {
	  				socket.emit('dialogs', {begin: -1, end: -1})
	  				if (listdialogs.value)
	  					socket.emit('messages', {dialogId: listdialogs.value})
	  			})
	  			
	  			socket.on('dialogs', (data) => {
	  				const prevValue = listdialogs.value
	  				if (data.dialogs.length && !)
	  				listdialogs.innerHTML = ''
	  				data.dialogs.forEach((element) => {
	  					listdialogs.options[listdialogs.options.length] = new Option("id " + element.name,element.id)
	  					if (element.id == prevValue)
	  						listdialogs.value = prevValue
	  				})
	  				
	  				if (prevValue != listdialogs.value) {
	  					if (!listdialogs.value) {
	  						chat.hidden = true
	  						return
	  					}
	  					
	  					chat.hidden = false
	  					listdialogs.dispatchEvent(new Event('change'))
	  				}
	  			})
	  			
	  			socket.on('dialog', (data) => {
	  				listdialogs.options[listdialogs.options.length] = new Option("id " + data.name,data.id)
	  			})
	  			
	  			socket.on('message', (data) => {
					if (listdialogs.value == data.dialogId)
						chatTable.innerHTML += '</td><td>' + data.name +'</td><td>'+'</td><td>' + data.message+'</td><td>' +'</td><td>'+ data.date + '</td></tr>'
	  			})
	  			
	  			socket.on('messages', (data) => {
					if (listdialogs.value == data.dialogId) {
						chatTable.innerHTML = ''
						data.messages.forEach((mes) => {
							chatTable.innerHTML += '</td><td>' + mes.name +'</td><td>'+'</td><td>' +
								mes.message+'</td><td>' +'</td><td>'+ mes.date + '</td></tr>'
						})
					}
	  			})
	  			
	  			submit.onclick = () => {
					if(messageText.value == '') return 

					let select = document.getElementById("listdialogs")
					let value = select.options[select.selectedIndex].value;
	  				socket.emit('message', {dialogId : value, message: messageText.value})
	  				messageText.value = ''
				}
	  			
	  			create.onclick = () => {
	  				socket.emit('dialog', {name: dialogName.value, users: users.value.split('\n')})
	  				dialogName.value = ''
	  				users.value = ''
	  			}
	  			
	  			listdialogs.onchange = () => {
	  				if (listdialogs.value)
	  					socket.emit('messages', {dialogId: listdialogs.value})
	  				
	  				messageText.value = ''
	  			}
	  		}
			
			req.send()

			exit.onclick = () => {
				const ereq = new XMLHttpRequest()
				ereq.open('GET', '/req/exit.js', true)
				ereq.onreadystatechange = () => {
					if (ereq.readyState != 4) return;
					
					state.textContent = ereq.status
					rcode.textContent = ereq.responseText
				}
				ereq.send()
			}