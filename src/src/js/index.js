
// syntax highlighting 
hljs.initHighlightingOnLoad();

// juicySlider
// index.js
var slider1 = new JuicySlider({
	elName: 'slider1Container',
	direction: 'horizontal',
	type: 'basic',
	carousel: false,
	replay: false,
	visEl: 1,
	offset: 1,
	autoscroll: {
		on: true,
		interval: 5000
	}
}).init();