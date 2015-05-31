describe("HsSlider: Basic", function() {

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

	config = {
		elName: 'testSlider',
		direction: 'horizontal',
		visEl: 1,
		offset: 1,
		replay: true,
		carousel: true,
		slideSpeed: 800,
		includeArrows: true,
		autoScroll: {
			interval: 5000,
			stopOnHover: true
		}
	};

	beforeEach(function() {
		// init Html
		elem = setFixtures(html);

		// init Slider
		slider = new JuicySlider(config);

		spyOn(slider, '_buildLayout');
		spyOn(slider, 'slide');
		spyOn(slider, 'currentlySliding').and.returnValue(false);

		// spyOn(slider, 'prev');

	});

	afterEach(function() {
		slider = undefined;
		elem = undefined;
	});

	describe("global funcitons", function() {
		it("shoud rebuild the slider", function() {
			slider.rebuild();
			expect(slider._buildLayout).toHaveBeenCalled();
		});

		it("shoud slide to next", function() {
			slider.next();
			expect(slider.slide).toHaveBeenCalled();
		});

		it("shoud slide to prev", function() {
			slider.prev();
			expect(slider.slide).toHaveBeenCalled();
		});

		it("shoud know if its currently sliding", function() {
			expect(slider.currentlySliding()).not.toBeTruthy();
			expect(slider.currentlySliding).toHaveBeenCalled();
			expect(slider.currentlySliding()).toEqual(slider.options.currentlySliding);
		});

		it("shoud pause if its not currently sliding", function() {
			slider.pause();
			expect(slider.options.pause).toBeTruthy();
		});


		it("shoud return the current slide", function() {
			expect(slider.activeEl()).toEqual(slider.options.current);
		});

	});
});