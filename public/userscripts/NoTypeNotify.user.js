// ==UserScript==
// @name	No Typing Notification
// @namespace	http://mauve.us.to
// @description	Blocks people from seeing you tying in facebook chats, also prevents the "seen" notification on messages.
// @include	https://www.facebook.com/*
// ==/UserScript==
(function(){
	var toblock = [
		"/ajax/messaging/typ.php",
		"/ajax/mercury/change_read_status.php"];
	var oldopen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(method, url){
		//console.log(arguments);
		for(var i = 0,j=toblock.length;i < j;++i){
			if((""+url).indexOf(toblock[i]) !== -1)return "";
		}
		return oldopen.apply(this,arguments);
	};
})();
