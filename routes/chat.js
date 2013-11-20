var app = require("../").app,
	server = require("../").server,
	fs = require('fs'),
	jade = require('jade'),
	sockjs = require("sockjs");

var makeMessage = (function () {
	var template = fs.readFileSync(__dirname + "/../templates/mixins/chatMessage.jade");
	return jade.compile(template, {
		pretty: true
	});
})();

var rooms = {};

function toRoom(room, message) {
	if (room in rooms) {
		rooms[room].sockets.forEach(function (socket) {
			socket.json(message);
		});
	}
}

function registerRoom(name) {
	rooms[name] = {
		users: [],
		sockets: [],
		name: name,
		buffer: []
	}
}

function writeJSON(message) {
	this.write(JSON.stringify(message));
}
chat = sockjs.createServer();
chat.on("connection", function (socket) {
	var room, name;
	socket.json = writeJSON;
	socket.on("data", function (message) {
		var message = JSON.parse(message);
		console.log(message);
		if ("object" !== typeof message)
			return socket.json({
				type: "error",
				name:"INVALID",
				message: "Invalid message recieved"
			});
		if (message.type == "join") {
			room = null;
			if (name)
				return socket.json({
					type: "error",
					name:"JOINED",
					message: "Already joined as " + name
				});
			var roomName = message.room;
			if (!roomName)
				return socket.json({
					type: "error",
					name:"NOROOM",
					message: "No room name was specified"
				});
			if (!message.name)
				return socket.json({
					type: "error",
					name:"NONAME",
					message: "No name was specified"
				});
			if(!(roomName in rooms))
				registerRoom(roomName);
			room = rooms[roomName];
			if (room.users.indexOf(message.name) >= 0)
				return socket.json({
					type: "error",
					name:"REGISTERED",
					message: "That name is already registered"
				});
			name = message.name;
			room.users.push(name);
			room.sockets.push(socket);
			socket.json({
				type: "login",
				name:name,
				messages: room.buffer,
				users: room.users.join(", ")
			});
			toRoom(room.name,{
				type: "join",
				user:name
			})
		} else if (message.type === "say") {
			if (!room || !name) return socket.json({
				type: "error",
				name:"NOTJOINED",
				message: "You must login before speaking"
			});
			var msg = {
				type: "say",
				user: name,
				message: message.message
			};
			room.buffer.push(msg);
			if(room.buffer.length > 10)
				room.buffer.length = 10;
			toRoom(room.name, msg);
		} else {
			socket.json({
				type: "error",
				name:"INVALID",
				message: "Invalid command type sent: "+message.type
			})
		}
	});
	socket.on("close", function () {
		if (room) {
			console.log(name + " left "+room.name)
			var index = room.sockets.indexOf(socket);
			if (index >= 0)
				room.sockets.splice(index, 1);
			if (name) {
				index = room.users.indexOf(name);
				if (index >= 0)
					room.users.splice(index, 1);
				toRoom(room.name, {
					type: "quit",
					user: name
				});
			}
		}
	});
});

chat.installHandlers(server, {
	prefix: "/chat"
});

app.get("/c",function(req,res){
	var roomdata = {};
	for(var k in rooms){
		roomdata[k]={
			users:rooms[k].users,
			buffer:rooms[k].buffer,
		};
	}
	res.json(roomdata);
});

app.get("/c/:room", function (req, res) {
	var roomName = req.params.room;
	var messages = (roomName in rooms) ? rooms[roomName].buffer : [];
	res.render("chat", {
		room: req.params.room,
		messages: messages
	});
});
