// ==UserScript==
// @name	Autopoke
// @namespace	http://mauve.us.to
// @description	Navigate to your Facebook pokes page and have this script automagically poke back.
// @include	https://www.facebook.com/pokes
// ==/UserScript==
(function(){
	function pokemon(){
		var as= document.querySelectorAll(".mam.pam");
		for(var i =0,j=as.length; i < j; ++i)
			if(as[i].id){
				var e = as[i];
				if(e.id.indexOf("poke_live_item") !=-1){
					e.querySelectorAll("a")[2].click();
				}
			}
	}
	setInterval(pokemon,3000);
})();
