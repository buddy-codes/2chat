const express = require("express");
const http = require("http");
const wss = require("socket.io");
const path = require("path");
const { QuickDB } = require('quick.db');

require("ejs");

const app = express();
const db = new QuickDB();
const server = http.Server(app);
const ws = wss(server);
const users = [];

ws.on("connection", socket => {
  users.push(socket.id);

  socket.on("UserMessage-Lobby", async message => {
    let resp = await require("node-fetch")("https://replit.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "ReplitProfilePictures",
        Referer: "https://replit.com"
      },
      body: JSON.stringify({
        query:
          "query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
        variables: { username: message.author }
      })
    }).then(res => res.json());

    let data = resp.data || {};
    message.pfp = data.user
      ? data.user.image
      : "https://www.gravatar.com/avatar/70f68d9254a26e13edbd59e97869969b?d=https://repl.it/public/images/evalbot/evalbot_24.png&s=256";

		if (message.author == "bddy") {
			message.author = "[Developer] " + message.author
		}

    ws.emit("UserMessage-Lobby", message);
		await db.push('messages', message)
  });
});

app.use(express.static("public"));
app.set("view engine", "ejs");

let whitelist = ["bddy", "zplusfour", "RayhanADev", "haroon", 'discordaddict'];

app.get("/", async (req, res) => {
	let cachedMessages = await db.get('messages');
	let cpt = req.query['compact'] || true
	console.log(cpt)
  const username = req.get("X-Replit-User-Name") || null;
  // console.log(username);
  // if (!whitelist.includes(username))
  //   return res.send(
  //     "You are currently not whitelisted for <b>2chat</b>. Please wait untill we release. Thanks!"
  //   );
  res.render("index", {
    user: {
      name: username
    },
		cpt,
		cachedMessages
  });
	// console.log(cachedMessages)
});

app.get("/lg", (req, res) => {
  res.send(
    `		<script authed="location.href = '/' " src="https://auth.util.repl.co/script.js"></script>`
  );
});

server.listen(80);
