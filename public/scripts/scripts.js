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

$("#viewFrame").load(function(){
	console.log("ViewFrame has loaded");
	function updateSize(){
		var b = $(this.contentWindow.document);
		this.style.height = b.height()+"px";
		this.style.display = "block";
	}
	setTimeout(updateSize.bind(this),100);
})
