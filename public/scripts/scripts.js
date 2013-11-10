// Initialize the menu tabs
$menu = $("menu .item");
$menu.tab();

// Initialize the chat side bar
$chat = $("#chat");
$chatToggle = $("#chattoggle");
$chat.sidebar();
$chatToggle.click(function () {
	$chatToggle.toggleClass("active");
	$chat.sidebar("toggle");
});

// Initialize handlers or the viewframe
$viewFrame = $("#viewFrame");
$viewFrame.load(function () {
	console.log("ViewFrame has loaded");
	newheight = this.contentWindow.document.body.scrollHeight;
	this.height = newheight + "px";
	this.style.display = "block";
});

// Initialize handlers for view links
$(".view_link").click(function () {
	$viewFrame[0].style.display = "none";
	location.hash = "#view/" + this.dataset.link;
	$menu.tab("change tab", "view");
	$viewFrame[0].src = this.dataset.link;
});

// Automagically load the apropriate tab when you load the apge
(function () {
	var hash = location.hash;
	if (!hash.length) return;
	var match = hash.match(/#view(\/.+)/);
	if (match) {
		$viewFrame[0].style.display="none";
		$viewFrame[0].src = match[1];
		$menu.tab("change tab", "view");
	} else {
		$menu.tab('change tab', hash.slice(1));
	}
})();