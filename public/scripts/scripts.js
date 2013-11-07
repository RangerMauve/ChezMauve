$("menu .item").tab();

(function(){
	var hash = location.hash;
	if(!hash.length)return;
	$("menu .item").tab('change tab', hash.slice(1));
})();
