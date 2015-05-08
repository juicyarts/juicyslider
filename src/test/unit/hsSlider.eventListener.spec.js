describe("HsSlider: Event Management", function() {

	var slideSpy, elem, config;

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
		el: 'testSlider',
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
		slider = new juicySlider(config);
		// init html
		elem = setFixtures(html);

		spyOn(slider, 'next');
		spyOnEvent('#prev', 'click');

		spyOn(slider, 'prev');
		spyOnEvent('#next', 'click');

	});

	afterEach(function() {
		slider = undefined;
		elem = slider;
	});

	describe("initListeners", function(){

		it("should fire events on Click", function() {
			slider.init();

			$('#prev').click();
			expect('click').toHaveBeenTriggeredOn('#prev');
			expect(slider.prev).toHaveBeenCalled();

			$('#next').click();
			expect('click').toHaveBeenTriggeredOn('#next');
			expect(slider.next).toHaveBeenCalled();

		});

		it("should set the active Class on proper element", function() {
			slider.init();

			$('#prev').click();
			expect('click').toHaveBeenTriggeredOn('#prev');
			expect(slider.prev).toHaveBeenCalled();

			$('#next').click();
			expect('click').toHaveBeenTriggeredOn('#next');
			expect(slider.next).toHaveBeenCalled();


		});

	});
});