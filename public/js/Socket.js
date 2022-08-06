(async () => {
	var selem = document.currentScript;

	// var username = selem.attributes.u.value

	var username = selem.getAttribute("u")
	var socket = io();

	console.log(username)
	if (username == null || username == "") {
		console.log(username)
		document.getElementById("container").style.display = "none"
		document.getElementById("login").style.display = "flex"
	}

	// socket.on('LoadDatabaseMessages', (m) => {
	// 	m.map(ms => {
	// 		socket.emit('UserMessage', { author: ms.author, date: ms.date, content: m.content })
	// 	})
	// })

	socket.on('UserMessage', message => {
		function timeSince(timeStamp) {
			var now = new Date(),
				secondsPast = (now.getTime() - timeStamp) / 1000;
			if (secondsPast < 60) {
				return parseInt(secondsPast) + 's';
			}
			if (secondsPast < 3600) {
				return parseInt(secondsPast / 60) + 'm';
			}
			if (secondsPast <= 86400) {
				return parseInt(secondsPast / 3600) + 'h';
			}
			if (secondsPast > 86400) {
				day = timeStamp.getDate();
				month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
				year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
				return day + " " + month + year;
			}
		}
		let chat = document.getElementById("chat")
		let m = document.createElement("div")
		m.id = "message"
		m.innerHTML = `
		<div style="display:flex;align-items:center;">
			<img class="pfp" src="${message.pfp}" />
			<span id="author">${message.author}</span>
			<span id="date">${timeSince(message.date)}</span>
		</div>
		<p id="text">${message.content}</p>
		`
		chat.appendChild(m)
		chat.scrollTo(0, document.body.scrollHeight);
	});

	let ipt = document.getElementById("sendmsg")
	let s = document.getElementById("smbt")

	function send() {
		if (ipt.value == "/test") {
			function timeSince(timeStamp) {
				var now = new Date(),
					secondsPast = (now.getTime() - timeStamp) / 1000;
				if (secondsPast < 60) {
					return parseInt(secondsPast) + 's';
				}
				if (secondsPast < 3600) {
					return parseInt(secondsPast / 60) + 'm';
				}
				if (secondsPast <= 86400) {
					return parseInt(secondsPast / 3600) + 'h';
				}
				if (secondsPast > 86400) {
					day = timeStamp.getDate();
					month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
					year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
					return day + " " + month + year;
				}
			}
			let chat = document.getElementById("chat")
			let m = document.createElement("div")
			m.id = "message"
			m.innerHTML = `
		<div style="display:flex;align-items:center;">
			<img class="pfp" src="https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256" />
			<span id="author">System</span>
	 		<span id="bottag">Verified Bot</span>
			<span id="date">${timeSince(new Date().getTime())}</span>
		</div>
		<p id="text">Pong</p>
		`
			chat.appendChild(m)
			chat.scrollTo(0, document.body.scrollHeight);
			return;
		}


		socket.emit("UserMessage", { author: username, date: new Date().getTime(), content: ipt.value });
		ipt.value = ""
	}

	s.addEventListener("click", e => {
		if (ipt.value == "") return;
		send()
	})

	ipt.addEventListener('keydown', e => {
		if (ipt.value == "") return;
		if (e.key == "Enter") {
			send()
		}
	})
})();