describe("HsSlider: Style Manipulation", function() {

	var slideSpy, elem, config, properVal;

	html = '<div id="testSlider" class="sliderContainer">';
	html += '<div id="prev" class="jArrowPrev"></div>';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';

	html += '<li class="item-1"></li>';
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
		visEl: 2,
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
		// init html
		elem = setFixtures(html);

		slider = new JuicySlider(config);

	});

	afterEach(function() {
		slider = undefined;
		elem = undefined;
	});

	describe("Suite: Style Manipulation", function() {
		describe("buildLayout", function() {
			it("should pass the proper size to the slideWrapper", function() {
				slider._errorHandler(slider.options);
				slider._configureDependencies(slider.options);
				slider._buildLayout(slider.options);

				if (slider.options.direction === 'horizontal') {
					properVal = $('#testSlider ul li').length * $('#testSlider ul li').width();
					expect($('#testSlider ul').width()).toBeGreaterThan(properVal);
				} else {
					properVal = $('#testSlider ul li').length * $('#testSlider ul li').height();
					expect($('#testSlider ul').height()).toBeGreaterThan(properVal);
				}
			});

			it("should pass Style Attributes to components ", function() {
				slider.init();
				if (slider.options.includeArrows && slider.options.arrowCtrl !== false) {
					if (slider.options.itemwidth !== 'auto') {
						expect(slider.options.arrowStyle).toBeDefined();
					} else {
						expect(slider.options.arrowStyle).not.toBeDefined();
					}
				} else {
					expect(slider.options.autoScroll).toBeDefined();
				}

				expect(slider.options.wrapperStyle).toBeDefined();
				expect(slider.options.sliderStyle).toBeDefined();

			});
		});

		it("should set properties for Container", function() {

			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);

			expect($('#' + config.elName + '')).toHaveCss({
				overflow: 'hidden'
			});
		});

		it("should bind transition to Slider", function() {

			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);

			// could not be tested in phantom js , no transition methods available
			expect($('#' + config.elName + ' .jSlideWrapper ul')).toHaveCss({
				transition: "all 0.8s ease-in-out 0s"
			});
		});

		it("should activate the right element on load", function() {
			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);
			var temp = 1 + slider.options.offset;
			expect($('#' + config.elName + ' ul li:nth-child(' + temp + ')')).toHaveClass('active');
		});


		it("should make the focus element bigger than the rest", function() {
			slider.options.focus = {
				itemwidth: 2
			};

			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);

			expect($('#' + config.elName + '  ul li.active').width()).toBeGreaterThan($('#' + config.elName + ' ul li:not(.active)').width());
		});

		it("should make the slider big enough so every element fits when focus element is set", function() {
			slider.options.focus = {
				itemwidth: 2
			};

			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);

			var calcItem = function() {
				var value, defEl, focEl;
				defEl = $('#' + config.elName + '  ul li:not(.active)').width();
				focEl = $('#' + config.elName + '  ul li.active').width();
				value = (defEl * slider.options.trueSlideLength - 1) + focEl;

				return value;
			};

			expect($('#' + config.elName + '  ul').width()).toBeEqual(calcItem);

		});

		// maybe just possible as e2e
		it("should arrange the Arrows and the content Properly", function() {
			if (slider.options.includeArrows) {
				expect($('#' + config.elName + ' > .jArrowPrev')).toBeInDOM();

				expect(function() {
					return ($('#' + config.elName + '  ul').width() + ($('#' + config.elName + ' .jArrow').width() * 2));
				}()).toEqual($('#' + config.elName + '  .jSlideWrapper').width());

			}
		});
	});
});