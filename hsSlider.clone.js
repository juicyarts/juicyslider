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
		autoScroll: false
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

	describe("Carousel", function() {
		it('should creaete the right amount of clone elements', function (done) {
			slider.init()

			expect(slider.options.carousel).toBeTruthy();
			done();
		});
	});

	
	
});