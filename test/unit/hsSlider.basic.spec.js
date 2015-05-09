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
	});

	afterEach(function() {
		slider = undefined;
		elem = undefined;
	});

	describe("new Slider", function() {
		it("should accept config from outside", function() {
			for (var option in config) {
				if (option !== 'el') {
					expect(slider.options[option]).toEqual(config[option]);
				}
			}
		});



		it("should set unset params itself", function() {
			expect(slider.options.scrollBy).toBe(0);
			expect(slider.options.indicator).not.toBeTruthy();
		});

	});


	describe(" Indicator ", function() {
		it(" should display indicator ", function() {
			expect(slider.indicator).toBeTruthy();
		});
		it(" should be in Dom ", function() {
			expect($('#testSlider .indicator')).toBeInDOM();
		});
	});
	

	describe("configureDependencies", function() {
		it("shoud set the right classes", function() {
			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);

			expect($('#testSlider')).toHaveClass('jContainer');
			expect($('#testSlider')).toHaveClass('sliderContainer');
			expect($('#testSlider')).toHaveClass(slider.options.direction);
			expect($('#testSlider ul')).toHaveClass('jSlider');

		});

		it("should be aware of arrowCtrl setup", function() {
			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);

			if (slider.options.arrowCtrl !== false) {
				expect($('#prev')).toHaveClass('jArrow');
			}
		});

	});
});