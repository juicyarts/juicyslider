describe("JuicySlider: Dummy Html", function() {

	var slideSpy, elem, config;

	html = '<div id="testSlider" class="sliderContainer">';
	html += '<div id="prev" class="jArrowPrev"></div>';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';

	html += '<li></li>';
	html += '<li></li>';
	html += '<li></li>';
	html += '<li></li>';

	html += '</ul>';
	html += '</div>';
	html += '<div id="next" class="jArrowNext"></div>';
	html += '</div>';

	beforeEach(function() {
		// init html
		elem = setFixtures(html);
	});

	// Html for Test
	describe("Suite: Basic Html Setup for test env", function() {
		it("should load the dummy html", function() {
			expect(elem).toBeDefined();
		});

		it("should contain a list wrapper and list items", function() {
			expect(elem[0]).toContainElement('ul');
			expect($('#testSlider ul > li')).toBeInDOM();
		});
	});
});