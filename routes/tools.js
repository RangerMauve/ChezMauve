module.exports = function (app) {
	app.get("/tools", function (req, res) {

		res.render("viewlist", {
			title: "Tools",
			tab: "Tools",
			list: {
				description: "These are some useful tools for performing various tasks",
				items: [
					{
						title: "Flash Cards",
						description: "A tool that can be used to help memorize things. Record question - answer pairs",
						url: "/view/singles/FlashCards.html",
						icon: "book"
					},
					{
						title: "Soundz",
						description: "A toy for generating sounds with an Oscillator in your browser. Open several windows and jam out.",
						url: "/view/singles/Soundz.html",
						icon: "music"
					},
					{
						title: "SVG Test",
						description: "This can be used to test making SVG images, it lets you view the SVG image you're working on on the right of the page.",
						url: "/view/singles/SVG-Test.html",
						icon: "photo"
					},
					{
						title: "Random From List",
						description: "Chooses one item from a list specified",
						url: "/view/singles/RandomFromList.html",
						icon: "tasks"
					},
					{
						title: "Random Remove",
						description: "Removes a random item from a list until there are none left",
						url: "/view/singles/RandomRemover.html",
						icon: "tasks"
					},
					{
						title: "List Randomizer",
						description: "Shuffles a list of items in a random fashion",
						url: "/view/singles/ListRandomizer.html",
						icon: "tasks"
					}
			]
			}
		})
	})
}
