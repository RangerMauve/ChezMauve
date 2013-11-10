// ==UserScript==
// @name	FunNewsSubstitutions
// @namespace	http://mauve.us.to
// @description	This is a filter I made that makes reading news more fun, I got the idea from http://xkcd.com/1288/
// @include	*
// ==/UserScript==

// Wrapper to keep things in their own scope
(function(){
	
// Generate the replacement map
var f = {
	"these dudes I know":/witnesses/mig,
	"kinda probably":/allegedly/mig,
	"Tumblr post":/new study/mig,
	"Avenge":/rebuild/mig,
	"SPAAACE":/space/mig,
	"Virtual Boy":/google glass/mig,
	"Pokédex":/smart\s?phone/mig,
	"atomic":/electric/mig,
	"Elf-Lord":/senator/mig,
	"cat":/car/mig,
	"eating contest":/election/mig,
	"river spirits":/congressional leaders/mig,
	"Homestar Runner":/homeland security/mig,
	"is guilty and everyone knows it":/could not be reached for comment/mig
}

// Gets all the text nodes from a given DOM node
function getTextNodes(from){
	var n, a=[], w=document.createTreeWalker(from,NodeFilter.SHOW_TEXT,null,false);
	while(n=w.nextNode())a.push(n);
	return a;
}

// Processes an array of TextNodes and performs substitution on the text they contain
function substitute(a){
	a.forEach(function(e){
		var key;
		for(key in f)e.nodeValue=e.nodeValue.replace(f[key],key);
	});	
}

// Do the substitution on everything at page load
substitute(getTextNodes(document.body));

// Perform the substitution whenever a new node is added to support AJAX sites
document.body.addEventListener("DOMNodeInserted",function(e){
	substitute(getTextNodes(e.target));
});

})();
