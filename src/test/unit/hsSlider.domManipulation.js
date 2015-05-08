describe("HsSlider: Dom Manipulation", function() {

	var slideSpy, elem, config, html;

	html = '<div id="testSlider" class="sliderContainer">';
	html += '<div id="prev" class="jArrowPrev"></div>';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';
	html += '<li>1</li>';
	html += '<li>2</li>';
	html += '<li>3</li>';
	html += '<li>4</li>';
	html += '</ul>';
	html += '</div>';
	html += '<div id="next" class="jArrowNext"></div>';
	html += '</div>';

	html += '<div id="testTabNav">';
	html += '<div class="jSlideWrapper">';
	html += '<ul>';
	html += '<li>1</li>';
	html += '<li>2</li>';
	html += '<li>3</li>';
	html += '<li>4</li>';
	html += '</ul>';
	html += '</div>';
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
	});

	afterEach(function() {
		slider = undefined;
		elem = undefined;
	});

	describe("Dom Manipulaiton", function() {

		describe("buildCarousel", function() {
			it("should create the right amount of clone elements if carousel option is selected", function() {
				slider._errorHandler(slider.options);
				slider._configureDependencies(slider.options);
				slider._buildCarousel(slider.options);

				if (slider.options.carousel) {

					cloneRight = Math.floor(slider.options.visEl / 2);
					cloneLeft = slider.options.visEl % 2;

					if (slider.options.visEl % 2 > 0 && slider.options.visEl > 1) {
						cloneRight += 1;
						if (slider.options.visEl > 3) {
							cloneLeft = cloneRight - 1;
						}
					}

					if (cloneRight > 0 && cloneLeft === 0) {
						cloneLeft = cloneRight;
					} else if (cloneRight === 0 && cloneLeft > 0) {
						cloneRight = cloneLeft;
						cloneLeft = 0;
					}

					cloneLeft = cloneRight;

					var slideLength = cloneLeft + cloneRight + slider.options.trueSlideLength;
					expect($('#testSlider ul li').length).toEqual(slideLength);
					expect($('#testSlider ul li.clone').length).toEqual(cloneRight + cloneLeft);
				}
			});
		});

		describe("bindTabCtrl", function() {
			it("should initiate tabnavigation connection if tabnavigation is true", function() {

				// slider.options.tabCtrl = {
				// 	el: 'testTabNav',
				// 	carousel: true,
				// 	visEl: 3
				// }

				slider._errorHandler(slider.options);
				slider._configureDependencies(slider.options);

				if (slider.options.tabCtrl !== false) {
					slider._buildCarousel(slider.options);
					slider._bindTabCtrl(slider.options);

					expect($('#' + slider.options.tabCtrl.el)).toBeInDOM();
					expect($('#' + slider.options.tabCtrl.el + ' ul')).toBeInDOM();

					if (slider.options.tabCtrl.carousel !== true) {
						expect($('#' + slider.options.tabCtrl.el + ' ul li').length).toEqual(slider.options.trueSlideLength);
					} else {
						expect($('#' + slider.options.tabCtrl.el + ' ul li').length).toEqual($('#' + slider.options.elName + ' ul li').length);
					}
				}
			});
		});

		it("should accept external Controls", function() {
			if (slider.options.extCtrl !== undefined) {
				expect(slider.options.extCtrl.prev).toBeDefined();
				expect(slider.options.extCtrl.next).toBeDefined();
			}
		});

		it("should be able to control external Elements", function() {
			if (slider.options.extSlider !== undefined) {
				expect(slider.options.extSlider).toEqual(jasmine.any('Array'));
			}
		});

		it("should be able to initialize wihtout arrows", function() {

		});
	});
});