describe('HsSlider: Error Handler', function() {

	var slideSpy, elem, config;

	html = '<div id="testSlider" class="sliderContainer">';
	// html += '<div id="prev" class="jArrowPrev"></div>';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';

	html += '<li></li>';
	html += '<li></li>';
	html += '<li></li>';
	html += '<li></li>';

	html += '</ul>';
	html += '</div>';
	// html += '<div id="next" class="jArrowNext"></div>';
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
		// init html
		elem = setFixtures(html);

		slider = new JuicySlider(config);

	});

	afterEach(function() {
		slider = undefined;
		elem = undefined;
	});

	// Slider Error Handling
	describe('Suite: Error Handler', function() {
		describe('slidewrapper missing', function() {
			it('shoud return error if Slidewrapper is missing', function() {
				// remove componenet from html
				$('#testSlider .jSlideWrapper').remove();

				// slider._errorHandler(slider.options);
				expect(function() {
					slider._errorHandler(slider.options);
				}).toThrowError('jSslider says: The Slidewrapper is missing , .slidewrapper>ul>li ..');
			});

		});
		describe('<ul> missing', function() {
			it('should return error if <ul> is missing', function(done) {
				$('#testSlider .jSlideWrapper > ul').remove();

				// slider._errorHandler(slider.options);
				expect(function() {
					slider._errorHandler(slider.options);
				}).toThrowError('jSslider says: Slider could not be found in your dom');
				done();
			});
		});

		it('shoud return errors if config params are missing', function() {
			// test element to be undefined
			// or remove componenet from html
			slider.options.elName = undefined;

			// slider._errorHandler(slider.options);
			expect(function() {
				slider._errorHandler(slider.options);
			}).toThrow();
		});

		it('should throw no errors if everything is ok', function() {
			expect(function() {
				slider._errorHandler(slider.options);
			}).not.toThrow();
		});

	});
});