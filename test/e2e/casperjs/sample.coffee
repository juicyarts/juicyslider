
casper = require('casper').create()
utils = require('utils')

bounds = {}
listItems = []


getListItemLength =  ->
	listItems = document.querySelectorAll "#testSlider ul li"
	Array::map.call listItems, (e) ->
		e.getAttribute "class"

casper.start 'http://localhost:3000/templates/test.html'

casper.then ->
	@echo(' get av list Items ') 
	listItems = @evaluate getListItemLength

	@echo(' get component boundaries ') 
	
	bounds
		wrapper: this.getElementBounds "#testSlider"
		slideWrapper: this.getElementBounds "#testSlider .jSlideWrapper"
		slider: this.getElementBounds "#testSlider .jSlideWrapper ul"
		li: this.getElementBounds "#testSlider .jSlideWrapper ul li"
		liActive: this.getElementBounds "#testSlider .jSlideWrapper ul li.active"

	for key, value of bounds
		@echo(' boundaries of : ' + key  +  ' are ')
		utils.dump(value)

casper.run ->
	@echo listItems.length + ' li items found';
	@echo(' - ' + listItems.join('\n - '))

	@echo('casper done').exit()