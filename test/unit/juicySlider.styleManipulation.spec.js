describe("HsSlider: Style Manipulation", function() {

	var slideSpy, elem, config, properVal;

	html = '<div id="testSlider" class="sliderContainer">';
	html += '<div id="prev" class="jArrowPrev"></div>';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';

	html += '<li class="item-1"> test </li>';
	html += '<li class="item-2"> test 2 </li>';
	html += '<li class="item-3"> test 3 </li>';
	html += '<li class="item-4"> test 4 </li>';

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
		arrowCtrl: true,
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
			xit("should pass the proper size to the slideWrapper", function() {

				slider._errorHandler(slider.options);
				slider._configureDependencies(slider.options);
				slider._buildLayout(slider.options);

				if (slider.options.direction === 'horizontal') {
					properVal = $('#testSlider ul li').length * $('#testSlider ul li').width();
					expect($('#testSlider ul').width()).toEqual(properVal);
				} else {
					properVal = $('#testSlider ul li').length * $('#testSlider ul li').height();
					expect($('#testSlider ul').height()).toEqual(properVal);
				}
			});

			it("should pass Style Attributes to components ", function() {
				slider.init();

				if (slider.options.includeArrows && slider.options.arrowCtrl !== false) {
					expect(slider.options.arrowStyle).not.toBeDefined();
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

		xit("should bind transition to Slider", function() {

			slider._errorHandler(slider.options);
			slider._configureDependencies(slider.options);
			slider._buildLayout(slider.options);

			// could not be tested in phantom js , no transition methods available
			expect($('#' + config.elName + ' .jSlideWrapper ul')).toHaveCss({
				transition: "all 0.8s ease-in-out 0s"
			});
		});

		it("should activate the right element on load", function() {
			slider.init();
			var temp = slider.options.current+1; 
			expect($('#' + config.elName + ' ul li.item-' + temp)).toHaveClass('active');
		});
	});
});