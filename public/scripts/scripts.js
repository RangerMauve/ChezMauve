// Initialize the menu tabs
$menu = $("menu .item");
$menu.tab();

// Initialize the chat side bar
$chat = $("#chat").sidebar("attach events", "#chatToggle", "toggle")

function fitSize(e) {
	console.log("ViewFrame has loaded");

	function updateSize() {
		var b = $(this.contentWindow.document);
		this.style.height = b.height() + "px";
		this.style.display = "block";
	}
	setTimeout(updateSize.bind(e), 100);
}
