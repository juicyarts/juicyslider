/**
 * [description]
 * @return {[type]} [description]
 * author: huess@juicyarts.de
 * version: 0.1.0
 * name: juicySlider
 */
(function() {
	/**
	 * [JuicySlider description]
	 * @param {[type]} el [description]
	 */
	JuicySlider = function(el) {
		var slideAmount,
			slideLength,
			wrapperStyle,
			sliderStyle,
			arrowStyle,
			slides,
			itemwidth,
			arrowwidth,
			slideWrapperWidth,
			temp,
			cloneLeft,
			cloneRight,
			classes,
			extendOptions,
			defaultConfig,
			err,
			ww,
			il,
			opts,
			templeft,
			buildLayout,
			resizeListener,
			initListeners,
			slide,
			conditions = false,
			current = 0,
			self = this,
			autoScroll;

		/**
		 * parse external configuration
		 * @param  {[type]} source  [description]
		 * @param  {[type]} options [description]
		 * @param  {[type]} type    [description]
		 * @return {[type]}         [description]
		 */
		extendOptions = function(source, options, type) {
			for (var option in options) {
				source[option] = options[option];
			}
			if (type == 'options') {
				return source;
			}
		};

		defaultConfig = {
			elName: 'jSlideContainer',
			sliderName: 'jSlider', // slider name
			slideWrapperName: 'jSlideWrapper', // slide wrapper name
			itemsize: 'auto', // itemwidth in px
			visEl: 1, // number of visible elements, cant be set when itemwidth is set
			scrollToEnd: false, // TODO Optional config for visEl > 1 , if 4*li and li3 is active , li4 will be visible too , maybe you dont want to scroll further
			offset: 0, // Optional offset , usefull for centering Active Element in Carousel, or to shift all elements by 1 , make example
			scrollBy: 0, // Optional scrollBy Method if no Offset and 3 Items are visible slide by 3 to jump directly to 4th el and show 4/5/6
			carousel: false, // enable/disable carousel
			includeArrows: false, // include Arrows in Layout arrangement
			keyCtrl: false, // allow up/down/left/right keyCtrl for element
			sliderCtrl: false, // allow selecting slides via click
			replay: false, // if carousel option is unselected you can decide if the slider should start at the beginning after the last Element
			tabCtrl: false, // allow Ctrl over extern tabs , pending
			slideSpeed: 600, // SlideSpeed
			indicator: false, // show position indicators in slider TODO
			direction: 'vertical', // define direction the slider should behave
			responsive: true, // decide if window resize retriggers the layout
			autoScroll: false, // autmatic scrolling - > needs property interval in ms
			ctrlNname: 'jArrowNext', // ctrl element for next
			ctrlPname: 'jArrowPrev', // ctrl element for previous
			touch: false, // touch ctrl, pending
			pause: false, // pause autoscroll
			culySliding: false, // indicator if slider is currently transitioning
			current: 0, // current slide 
			easing: 'ease-in-out',
			currentlySliding: false
		};

		/**
		 * [if description]
		 * @param  {[type]} arguments[0] &&            typeof arguments[0] [description]
		 * @return {[type]}              [description]
		 */
		if (arguments[0] && typeof arguments[0] === 'object') {
			this.customOptions = true;
			this.options = extendOptions(defaultConfig, arguments[0], 'options');
		}


		/**
		 * Initalize slider settings
		 * @return {[Slider]} [return new Slider  Object]
		 */
		this.init = function() {

			// first let the errorHandler check if everything is available as needed
			this._errorHandler(this.options);

			// next set classes etc as reference for slider mechanism
			this._configureDependencies(this.options);

			// If Carousel option is selected
			// build clones and dependencies before building slider Layout
			if (this.options.carousel) {
				this._buildCarousel(this.options);
			}

			// build Layout
			this._buildLayout(this.options);

			initListeners(this.options);
			var self = this;
			if (this.options.autoScroll !== false) {
				// auto Play
				setInterval(autoScroll(), this.options.autoScroll.interval);
			}
		};

		/**
		 * Initialize AutoScroll
		 * @return {[type]} [description]
		 */
		autoScroll = function() {
			if (self.options.pause !== true) {
				self.options.currentlySliding = false;
				self.slide('next', self.options);
			}
		};

		/**
		 * Basic Error Handler
		 * @param  {[type]} options [description]
		 * @return {[type]}         [Errors if missconfigured]
		 */
		this._errorHandler = function(options) {
			err = {
				noEl: 'jSslider says: Container could not be found in your dom',
				noSlider: 'jSslider says: Slider could not be found in your dom',
				noCtrl: 'jSslider says: Arrows could not be found in your dom, you need something to control the slider or automate it',
				noSlideWrapper: 'jSslider says: The Slidewrapper is missing , .slidewrapper>ul>li ..'
			};

			// check if given Element is available in Dom
			if (document.getElementById(options.elName) !== null) {
				options.el = document.getElementById(options.elName);

				// check if Slide Wrapper is available in Dom
				if (options.el.getElementsByClassName(options.slideWrapperName).length > 0) {
					options.slideWrapper = options.el.getElementsByClassName(options.slideWrapperName);
					// check if Slide Wrapper is available in Dom
					if (options.el !== undefined) {
						if (options.el.getElementsByTagName('ul').length > 0 && options.el.getElementsByTagName('ul')[0] !== undefined) {
							options.slider = options.el.getElementsByTagName('ul');
							options.trueSlideLength = options.slider[0].getElementsByTagName('li').length;
						} else {
							throw new Error(err.noSlider);
						}
						if (options.autoScroll === false || options.keyCtrl === false) {
							if (options.el.getElementsByClassName(options.ctrlNname).length > 0 && options.el.getElementsByClassName(options.ctrlPname).length > 0) {
								options.ctrlN = options.el.getElementsByClassName(options.ctrlNname);
								options.ctrlP = options.el.getElementsByClassName(options.ctrlPname);
							} else {
								throw new Error(err.noCtrl);
							}
						} else {
							options.arrowCtrl = false;
						}
					}
				} else {
					throw new Error(err.noSlideWrapper);
				}
			} else {
				throw new Error(err.noEl);
			}


		};

		/**
		 * [_configureDependencies description]
		 * @param  {[type]}   options  [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		this._configureDependencies = function(options, callback) {
			// Set classes etc to identify the slider components
			options.el.className = 'sliderContainer jContainer ' + options.direction;
			options.slider[0].className = 'jSlider';

			if (options.arrowCtrl !== false || options.keyCtrl !== false) {
				options.ctrlN[0].classList.add('jArrow');
				options.ctrlP[0].classList.add('jArrow');
			}
		};

		/**
		 * [_buildCarousel description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		this._buildCarousel = function(options) {

			slides = options.slideWrapper[0].getElementsByTagName('li');

			// configure clones
			cloneRight = Math.floor(options.visEl / 2);
			cloneLeft = options.visEl % 2;

			// if a rest is given and more than one item is visible
			// there has to be +1 clone on the right side
			// furthermore if there are more than 3 elements in the visible area
			// the amount of clones on the left side hast to be rightside - 1
			if (options.visEl % 2 > 0 && options.visEl > 1) {
				cloneRight += 1;
				if (options.visEl > 3) {
					cloneLeft = cloneRight - 1;
				}
			}

			// if the amount of elements in the visible area is bigger than 0
			// and the division doesnt return a rest value
			// the left side Clone amount should be equal the Right side

			// if the division doesnt return a result 
			// the modolo is used as the Right value
			// and the left value is set to 0
			if (cloneRight > 0 && cloneLeft === 0) {
				cloneLeft = cloneRight;
			} else if (cloneRight === 0 && cloneLeft > 0) {
				cloneRight = cloneLeft;
			}

			// does this make sense given all the calculations above?
			cloneLeft = cloneRight;

			// if selecting slides by clicking on them is allowed, we need double
			// the amount of clones on each side to not show whitespace.
			if (options.sliderCtrl) {
				cloneLeft *= 2;
				cloneRight *= 2;
			}

			// If no active class is set set it manually / usualy on start;
			if (options.slideWrapper[0].getElementsByClassName('active').length === 0) {
				slides[options.current].classList.add('active');
			}

			// preparing clones for the right side
			for (var i = 0; i < cloneRight; i++) {
				clone = slides[i].cloneNode(true);
				clone.classList.add('clone-right');
				clone.classList.add('clone');
				options.slider[0].appendChild(clone);
			}

			// preparing clones for the left side
			for (var j = cloneLeft; j > 0; j--) {
				// Cloning slides from the 'right' of the original slides. As
				// clones are added to the left, the index of the to-be-cloned
				// slide keeps persistent.
				clone = slides[options.trueSlideLength-1].cloneNode(true);
				clone.classList.add('clone-left');
				clone.classList.add('clone');
				options.slider[0].insertBefore(clone, options.slider[0].firstChild);
			}

		};

		/**
		 * [_buildLayout description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		this._buildLayout = function(options) {

			slides = options.slider[0].children;
			slideLength = slides.length;

			// If no active class is set set it manually / usualy on start;
			if (options.slideWrapper[0].getElementsByClassName('active').length === 0) {
				slides[options.current].classList.add('active');
			}

			// if replay is false scrolling left is set to disabled by default
			if (!options.replay && !options.autoScroll) {
				options.ctrlP[0].classList.add('disabled');
			}

			// Element Style
			options.el.style.overflow = 'hidden';

			// jSlideWrapper
			wrapperStyle = {
				width: '100%',
				height: '100%'
			};

			// Main Element Width
			elWidth = options.el.clientWidth;
			elHeight = options.el.clientHeight;


			if (options.direction == 'horizontal') {

				// jSlide
				slideStyle = {
					width: 100 / slideLength + '%'
				};

				if (options.includeArrows) {
					if (options.itemsize !== 'auto') {
						itemwidth = options.itemsize;
						arrowwidth = options.ctrlN[0].clientWidth
						slideWrapperWidth = options.el.clientWidth;

						// set Visible elements	
						ww = slideWrapperWidth - (arrowwidth * 2);
						il = Math.floor(ww / itemwidth) > slideLength ? slideLength : Math.floor(ww / itemwidth);
						temp = ww / il;
						arrowwidth = slideWrapperWidth - itemwidth * il;
						options.visEl = il;

						wrapperStyle = {
							width: itemwidth * il + 'px',
							height: '100%',
							left: arrowwidth / 2 + 'px',
							position: 'absolute',
							overflow: 'hidden'
						};

						arrowStyle = {
							width: arrowwidth / 2 + 'px'
						};

						slideStyle.width = itemwidth + 'px';

						if (cloneLeft !== undefined) {
							templeft = -((cloneLeft - options.offset) * itemwidth) - (options.current * itemwidth) + 'px';
						} else {
							templeft = -(options.current * itemwidth) + 'px';
						}

						// jSlider
						sliderStyle = {
							width: itemwidth * slideLength + 1 + 'px',
							height: '100%',
							transform: 'translate3d(' + templeft + ',0,0)',
							webkitTransform: 'translate3d(' + templeft + ',0,0)'
						};

					} else {
						itemwidth = (100 / slideLength);
						arrowwidth = options.ctrlN[0].clientWidth;
						slideWrapperWidth = options.el.clientWidth;
						temp = (100 / slideWrapperWidth) * arrowwidth * 2;

						wrapperStyle = {
							width: 100 - temp + '%',
							height: '100%',
							left: temp / 2 + '%',
							position: 'absolute',
							overflow: 'hidden'
						};

						if (cloneLeft !== undefined) {
							templeft = -((cloneLeft - options.offset) * itemwidth) - (options.current * itemwidth) + '%';
						} else {
							templeft = -(options.current * itemwidth) + '%';
						}

						// jSlider
						sliderStyle = {
							width: (slideLength * 100) / options.visEl + '%',
							height: '100%',
							transform: 'translate3d(' + templeft + ',0,0)',
							webkitTransform: 'translate3d(' + templeft + ',0,0)'
						};
					}
				} else {
					arrowwidth = options.ctrlN[0].clientWidth;
					slideWrapperWidth = options.el.clientWidth;

					wrapperStyle = {
						width: 100 + '%',
						height: '100%',
						position: 'absolute',
						overflow: 'hidden'
					};

					if (cloneLeft !== undefined) {
						templeft = -((cloneLeft - options.offset) * 100 / slideLength) + '%';
					} else {
						templeft = '0%';
					}

					if (options.offset > 0 && options.visEl > 1 && !options.carousel) {
						templeft = ((options.current + options.offset) * 100 / slideLength) + '%';
					}

					// jSlider
					sliderStyle = {
						width: (slideLength * 100) / options.visEl + '%',
						height: '100%',
						transform: 'translate3d(' + templeft + ',0,0)',
						webkitTransform: 'translate3d(' + templeft + ',0,0)'
					};
				}

			} else {
				// jSlider
				sliderStyle = {
					width: '100%',
					height: slideLength * 100 + '%',
					top: '0%'
				};
				// jSlide
				slideStyle = {
					width: '100%',
					height: 100 / slideLength + '%'
				};
			}

			options.sliderStyle = sliderStyle;
			options.wrapperStyle = wrapperStyle;
			options.arrowStyle = arrowStyle;

			extendOptions(options.slideWrapper[0].style, wrapperStyle, 'style');
			extendOptions(options.slider[0].style, sliderStyle, 'style');

			for (var i = 0; i < slideLength; i++) {
				extendOptions(slides[i].style, slideStyle, 'style');
			}

			// add transition rules only after initial build to have a more immediate setup
			window.setTimeout(function() {
				extendOptions(options.slider[0].style, {transition: 'all ' + options.slideSpeed + 'ms ' + options.easing});
			}, 40);

		};

		/**
		 * [resizeListener description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		resizeListener = function(options) {
			window.addEventListener('resize', function() {
				self._buildLayout(options);
				self.slide(undefined, options);
			});
		};

		/**
		 * [initListeners description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		initListeners = function(options) {
			// resize Listener			
			if (options.responsive === true && options.carousel !== true) {
				resizeListener(options);
			}

			// ctrl listeners
			if (options.arrowCtrl !== false || options.keyCtrl !== false) {
				options.ctrlN[0].addEventListener('click', function() {
					if (!this.classList.contains('disabled')) {
						self.next();
					}
				});
				options.ctrlP[0].addEventListener('click', function() {
					if (!this.classList.contains('disabled')) {
						self.prev();
					}
				});
			}

			// KeyCtrl Listener
			if (options.keyCtrl) {
				document.addEventListener('keydown', function(ev) {
					// next
					if (!options.currentlySliding) {
						if (options.direction == 'horizontal') {
							if (ev.keyCode == 39) {
								self.next();
							} else if (ev.keyCode == 37) {
								self.prev();
							}
						} else {
							if (ev.keyCode == 40) {
								self.next();
							} else if (ev.keyCode == 38) {
								self.prev();
							}
						}
					}
				});
			}

			// each slide as a listener
			if (options.sliderCtrl && options.visEl > 1 && options.trueSlideLength > 1) {
				slides = options.slider[0].children;
				for (var i = 0; i < slideLength; i++) {
					slides[i].setAttribute('index', i);
					slides[i].addEventListener('click', function(ev) {
						// do nothing if slide is currently active
						if (this.classList.contains('active')) {
							return;
						}
						self.options.current = parseInt(this.getAttribute('index')) - (cloneLeft !== undefined ? cloneLeft : 0);
						self.slide(undefined, self.options);
					});
				}
			}
		};

		/**
		 * [destroy description]
		 * @return {[type]} [description]
		 */
		this.destroy = function() {

		};

		/**
		 * [rebuild description]
		 * @return {[type]} [description]
		 */
		this.rebuild = function() {
			this._buildLayout(this.options);
		};

		/**
		 * [next description]
		 * @return {Function} [description]
		 */
		this.next = function() {
			if (!this.options.currentlySliding) {
				this.slide('next', this.options);
			}
		};

		/**
		 * [currentlySliding description]
		 * @return {[type]} [description]
		 */
		this.currentlySliding = function() {
			return this.options.currentlySliding;
		};

		/**
		 * [prev description]
		 * @return {[type]} [description]
		 */
		this.prev = function() {
			if (!this.options.currentlySliding) {
				this.slide('prev', this.options);
			}
		};


		/**
		 * [pause description]
		 * @return {[type]} [description]
		 */
		this.pause = function() {
			if (!this.options.currentlySliding) {
				this.options.pause = true;
			}
		};

		/**
		 * [activeEl description]
		 * @return {[type]} [description]
		 */
		this.activeEl = function() {
			return this.options.current;
		};

		/**
		 * [slide description]
		 * @param  {[type]} direction [description]
		 * @param  {[type]} options   [description]
		 * @return {[type]}           [description]
		 */
		this.slide = function(direction, options) {

			options.currentlySliding = true;
			if (direction) {
				if (direction == 'prev') {
					if (options.current > 0) {
						if (!options.replay) {
							if (options.current > 1) {
								options.ctrlP[0].classList.remove('disabled');
							} else {
								options.ctrlP[0].classList.add('disabled');
							}
							if (options.current <= slideLength) {
								options.ctrlN[0].classList.remove('disabled');
							}
						}
						options.current--;
					} else {
						if (options.replay) {
							options.current--;
						} else {
							options.ctrlN[0].classList.remove('disabled');
							options.ctrlP[0].classList.add('disabled');
						}
					}
					if (options.replay) {
						// not sure if or how we ever reach this condition
						if (options.current >= slideLength - options.visEl + 1) {
							options.current = slideLength - options.visEl;
						}
					}
				} else {
					if (options.current < slideLength - 1) {
						options.current++;
						if (!options.replay) {
							options.ctrlP[0].classList.remove('disabled');

							if (!options.scrollToEnd) {
								if (options.current == slideLength - options.visEl) {
									options.ctrlN[0].classList.add('disabled');
								}
							} else {
								if (options.current == slideLength - options.offset) {
									options.ctrlN[0].classList.add('disabled');
								}
							}
						}

					} else {
						if (options.replay) {
							options.current = 0;
						}
					}

					if (options.replay) {
						// not sure if or how we ever reach this condition
						if (options.current >= slideLength - options.visEl + 1) {
							options.current = 0;
						}
					}

				}

			}

			// If the currently active slide is a clone, the slider needs to jump back to
			// the original slides.
			if (options.carousel && (options.current < 0 || options.current >= options.trueSlideLength)) {
				// the timeout should be a bit more 
				window.setTimeout(function() {

					options.slider[0].style.transition = 'none';
					if (options.current < 0) {
						options.current += options.trueSlideLength;
					} else {
						options.current -= options.trueSlideLength;
					}

					// set slideAmount
					slideAmount = -((cloneLeft - options.offset) * itemwidth) - (options.current * itemwidth);
					slideAmount += (options.itemsize !== 'auto') ? 'px' : '%';

					for (var i = 0; i < slideLength; i++) {
						slides[i].classList.remove('active');
					}

					slides[options.current + cloneLeft].classList.add('jump');
					slides[options.current + cloneLeft].classList.add('active');

					if (options.direction == 'horizontal') {
						options.slider[0].style.transform = 'translate3d(' + slideAmount + ',0,0)';
						options.slider[0].style.webkitTransform = 'translate3d(' + slideAmount + ',0,0)';
						removeJumpFlag = true;
					} else {
						options.slider[0].style.top = -slideAmount + '%';
						removeJumpFlag = true;
					}

					window.setTimeout(function() {
						if (removeJumpFlag) {
							options.slider[0].style.transition = 'all ' + options.slideSpeed + 'ms ' + options.easing;
							slides[options.current + cloneLeft].classList.remove('jump');
						}
					}, 40);

				}, (options.slideSpeed+100));
			}

			slideAmount = -(((cloneLeft !== undefined ? cloneLeft : 0) - options.offset) * itemwidth) - (options.current * itemwidth);
			slideAmount += (options.itemsize !== 'auto') ? 'px' : '%';

			// not sure if or how we ever reach this condition
			if (options.offset > 0 && options.visEl > 1 && !options.carousel) {
				slideAmount = -((options.current - options.offset) * 100 / slideLength) + '%';
			}

			for (var i = 0; i < slideLength; i++) {
				slides[i].classList.remove('active');
			}

			if (!options.carousel) {
				slides[options.current].classList.add('active');
			} else {
				slides[options.current + cloneLeft].classList.add('active');
			}

			if (options.slider[0]) {
				if (options.direction == 'horizontal') {
					options.slider[0].style.transform = 'translate3d(' + slideAmount + ',0,0)';
					options.slider[0].style.webkitTransform = 'translate3d(' + slideAmount + ',0,0)';
				} else {
					options.slider[0].style.transform = 'translate3d(0,' + slideAmount + ',0)';
					options.slider[0].style.webkitTransform = 'translate3d(0,' + slideAmount + ',0)';
				}
			}

			window.setTimeout(function() {
				options.currentlySliding = false;
			}, options.slideSpeed);

		};

	};

	// classList polyfill for ie < 10 by devongovett
	if (!('classList' in document.createElement('_'))) {
		Object.defineProperty(HTMLElement.prototype, 'classList', {
			get: function() {
				var self = this;

				function update(fn) {
					return function(value) {
						classes = self.className.split(/\s+/);
						index = classes.indexOf(value);

						fn(classes, index, value);
						self.className = classes.join(' ');
					};
				}

				var ret = {
					add: update(function(classes, index, value) {
						~index || classes.push(value);
					}),

					remove: update(function(classes, index) {
						~index && classes.splice(index, 1);
					}),

					toggle: update(function(classes, index, value) {
						~index ? classes.splice(index, 1) : classes.push(value);
					}),

					contains: function(value) {
						return !!~self.className.split(/\s+/).indexOf(value);
					},

					item: function(i) {
						return self.className.split(/\s+/)[i] || null;
					}
				};

				Object.defineProperty(ret, 'length', {
					get: function() {
						return self.className.split(/\s+/).length;
					}
				});

				return ret;
			}
		});
	}
}());