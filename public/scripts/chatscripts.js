var socket = new SockJS("/chat");
var $messages = $("#chatMessages");
var $input = $("#input");
var $login = $("#login");
var relogmsg = ["JOINED","NOROOM","NONAME","REGISTERED"];

socket.onmessage = function (message) {
	console.log(message);
	var data = JSON.parse(message.data);
	console.log(data);
	if (data.type === "error") {
		log("error", data.name, data.message);
		console.log(relogmsg.indexOf(data.name))
		if(relogmsg.indexOf(data.name)>=0){
			$login.find(".warning").show().text(data.message);
			$login.show();
			$messages.hide();
		}
	} else if (data.type === "say")
		say(data.user, data.message);
	else if (data.type === "login") {
		$("#inputContainer").removeClass("loading");
		$input.keypress(function (e) {
			var code = e.keyCode || e.which;
			if (code == 13 && !e.shiftKey) {
				socket.json({
					type: "say",
					message: $input.val()
				});
				$input.val("");
				return false;
			}
		});
	} else if (data.type === "quit")
		log("warning", "", data.user + " has left the room");
	else if (data.type === "join")
		log("info", "", data.user + " has joined the room");
}
socket.onclose = function(){
	log("error","Disconnected","Something went wrong and you're now disconnected fromt he chat. Try refreshing the page");
	$("#inputContainer").addClass("loading");
}
socket.json = function (message) {
	console.log("Sending:")
	console.log(message);
	this.send(JSON.stringify(message) + '\n');
}
socket.onopen = function () {
	$login.submit(function(){
		var name = $login.find("input").val();
		if(!name){
			$login.find(".warning").show().text("Please input a name");
			return false;
		}
		$messages.show();
		$login.hide();
		socket.json({
			type: "join",
			room: roomName,
			name: name
		})
		return false;
	});
}

function scrollDown() {
	$messages.scrollTop($messages.height());
}

function say(name, message) {
	$messages.append(
		'<div class="ui inverted purple segment">' +
		name + ": " + message + "</div>"
	);
	scrollDown();
}

function log(level, title, message) {
	$messages.append(
		'<div class="ui ' + level + ' message">' +
		'<div class="header">' + title + "</div>" +
		message + "</div>"
	);
	scrollDown();
}
scrollDown();
