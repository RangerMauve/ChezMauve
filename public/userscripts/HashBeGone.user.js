// ==UserScript==
// @name	Hash Be Gone
// @namespace	http://mauve.us.to
// @description	Do you hate #hashtags on the internet? Well this gets rid of all of them.
// @include	*
// ==/UserScript==

// Wrapper to keep things in their own scope
(function () {

	// Gets all the text nodes from a given DOM node
	function getTextNodes(from) {
		var n, a = [],
			w = document.createTreeWalker(from, NodeFilter.SHOW_TEXT, null, false);
		while (n = w.nextNode()) a.push(n);
		return a;
	}

	// Processes an array of TextNodes and performs substitution on the text they contain
	function substitute(a) {
		a.forEach(function (e) {
			e.nodeValue = e.nodeValue.replace(/#\S+/g, "");
		});
	}

	// Fix for Facebook
	function removeFB(from) {
		var lin = from.querySelectorAll("._58cn");
		[].forEach(lin, function (e) {
			e.remove();
		});
	}

	// Do the substitution on everything at page load
	substitute(getTextNodes(document.body));

	// Do the Facebook fix at page loads
	removeFB(document.body);

	// Perform the filtering whenever a new node is added to support AJAX sites
	document.body.addEventListener("DOMNodeInserted", function (e) {
		substitute(getTextNodes(e.target));
		removeFB(e.target);
	});

})();
