// ==UserScript==
// @name	Auto-Poker
// @namespace	http://mauve.us.to
// @description	Simple facebook autopoker. Open your pokes page and it will automatically respond to pokes.
// @include	https://www.facebook.com/pokes
// ==/UserScript==
(function(){
	function pokemon(){
		var as= document.querySelectorAll(".phm");
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