//	author: huess@juicyarts.de
//	version: 0.0.1
//	name: juicySlider


(function() {
	// constructor
	// ---------
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
			cloneAmount = current = 0,
			self = this;

		// ---------
		// extend mixin for differen purposes
		extendOptions = function(source, options, type) {
			for (var option in options) {
				source[option] = options[option];
			}
			if (type == 'options') {
				return source;
			}
		};

		// ---------
		// default options
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
			pause: false,
			currentlySliding: false
		};

		/*
		// optionals
			defaultconfig.autoScroll = { interval : 800 }
			defaultconfig.tabCtrl = { }
			defaultconfig.extCtr = { }
			defaultconfig.extSlider = { }
		*/

		// Replace default options with Options passed to jcySlider
		if (arguments[0] && typeof arguments[0] === "object") {
			this.customOptions = true;
			this.options = extendOptions(defaultConfig, arguments[0], 'options');
		}


		// ---------
		// init - make
		this.init = function() {

			this.options.current = this.options.carousel ? 0 + this.options.offset : 0;

			// first let the errorHandler check if everything is available as needed
			this._errorHandler(this.options);

			// next set classes etc as reference for slider mechanism
			this._configureDependencies(this.options);

			// If Carousel option is selected
			// build clones and dependencies before building slider Layout
			if (this.options.carousel) {
				this._buildCarousel(this.options);
			}

			// if there are Extern Controls
			if (this.options.extCtrl) {
				this.bindExtCtrl(this.options);
			}

			// if a Tab Nav is set
			if (this.options.tabCtrl !== false) {
				this._bindTabCtrl(this.options);
			}

			// If this slider should also control another element
			if (this.options.extSlider) {
				this.ConnectToExtSlider(this.options);
			}

			// build Layout
			this._buildLayout(this.options);

			initListeners(this.options);
			var self = this;
			if (this.options.autoScroll !== false) {
				// auto Play
				if (this.options.autoScroll.on) {
					setInterval(function() {
						if (self.options.pause !== true) {
							self.options.currentlySliding = false;
							slide('next', self.options);
						}
					}, this.options.autoScroll.interval);
				}
			}
		};

		// ---------
		// a bit of error handling
		this._errorHandler = function(options) {
			err = {
				noEl: "jSslider says: Container could not be found in your dom",
				noTabEl: "jSlider says: Tab Wrapper is not available in your dom",
				noTabSlider: "jSlider says: Tab Wrapper is not available in your dom",
				noTabChild: "jSlider says: Tab Children are not available in your dom",
				DiffLength: "jSlider says: Tab and Slide amounts dont match",
				noSlider: "jSslider says: Slider could not be found in your dom",
				noCtrl: "jSslider says: Arrows could not be found in your dom, you need something to controller the slider or automate it",
				noSlideWrapper: "jSslider says: The Slidewrapper is missing , .slidewrapper>ul>li .."
			};

			// check if given Element is available in Dom
			if (document.getElementById(options.elName) !== null) {
				options.el = document.getElementById(options.elName);
			} else {
				throw new Error(err.noEl);
			}

			// check if needed Contents are available in the given Element
			if (options.el.getElementsByTagName('ul') !== null ||  options.el.getElementsByTagName('ul') !== undefined) {
				options.slider = options.el.getElementsByTagName('ul');
				options.trueSlideLength = options.slider[0].getElementsByTagName('li').length;
			} else {
				throw new Error(err.noSlider);
			}
			if (options.el.getElementsByClassName(options.slideWrapperName) !== null) {
				options.slideWrapper = options.el.getElementsByClassName(options.slideWrapperName);
			} else {
				throw new Error(err.noSlideWrapper);

			}
			if (options.autoScroll === false) {
				if (options.el.getElementsByClassName(options.ctrlNname).length > 0 && options.el.getElementsByClassName(options.ctrlPname).length > 0) {
					options.ctrlN = options.el.getElementsByClassName(options.ctrlNname);
					options.ctrlP = options.el.getElementsByClassName(options.ctrlPname);
				} else {
					throw new Error(err.noCtrl);
				}
			} else {
				if (options.el.getElementsByClassName(options.ctrlNname).length > 0 && options.el.getElementsByClassName(options.ctrlPname).length > 0) {
					options.ctrlN = options.el.getElementsByClassName(options.ctrlNname);
					options.ctrlP = options.el.getElementsByClassName(options.ctrlPname);
				} else {
					options.arrowCtrl = false;
				}
			}


			// Check If TabCtrl Element is available when tabCtrl is set
			if (options.tabCtrl !== false) {
				if (document.getElementById(options.tabCtrl.el) !== null) {
					options.tabCtrl.domEl = document.getElementById(options.tabCtrl.el);
					if (options.tabCtrl.domEl.getElementsByTagName('ul') !== null ||  options.tabCtrl.domEl.getElementsByTagName('ul') !== undefined) {
						options.tabCtrl.slider = options.tabCtrl.domEl.getElementsByTagName('ul');
						if (options.tabCtrl.slider[0] !== undefined) {
							options.tabCtrl.trueSlideLength = options.tabCtrl.slider[0].getElementsByTagName('li').length;
						} else {
							throw new Error(err.noTabSlider);
						}
					} else {
						throw new Error(err.noTabChild);
					}
					if (options.trueSlideLength != options.tabCtrl.trueSlideLength) {
						throw new Error(err.DiffLength);
					}
				} else {
					throw new Error(err.noTabEl);
				}
			}
		};

		// ---------
		// configure dependencies
		this._configureDependencies = function(options, callback) {
			// Set classes etc to identify the slider components
			options.el.className = 'sliderContainer jContainer ' + options.direction;
			options.slider[0].className = 'jSlider';

			if (options.arrowCtrl !== false) {
				options.ctrlN[0].classList.add('jArrow');
				options.ctrlP[0].classList.add('jArrow');
			}
		};

		// ---------
		// build Carousel
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

			cloneLeft = cloneRight;

			// If no active class is set set it manually / usualy on start;
			if (options.slideWrapper[0].getElementsByClassName('active').length === 0) {
				slides[0].classList.add('active');
				if (options.direction == 'horizontal') {
					current = 1;
					slideAmount = -(current * 100) + '%';
				}
			}



			// preparing clones for the right side
			for (var i = 0; i < cloneRight; i++) {
				clone = slides[i].cloneNode(true);
				clone.classList.add('clone-right');
				clone.classList.add('clone');
				options.slider[0].appendChild(clone);
			}


			for (var j = cloneLeft; j > 0; j--) {
				var temp1 = slides.length - cloneRight - cloneAmount;
				if (options.visEl >= 3) {
					temp1 = temp1 + 1;
				}


				clone = slides[temp1 - cloneLeft].cloneNode(true);
				clone.classList.add('clone-left');
				clone.classList.add('clone');
				options.slider[0].insertBefore(clone, options.slider[0].firstChild);

				cloneAmount++;
			}
		};

		this._bindTabCtrl = function(options) {
			// TODO
		};

		// ---------
		// build layout
		this._buildLayout = function(options) {

			slides = options.slideWrapper[0].getElementsByTagName('li');
			slideLength = slides.length;

			// If no active class is set set it manually / usualy on start;
			if (options.slideWrapper[0].getElementsByClassName('active').length === 0) {
				slides[this.options.current].classList.add('active');
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

			// jSlider
			sliderStyle = {
				transition: 'all ' + options.slideSpeed + 'ms ease-in-out'
			};


			// Main Element Width
			elWidth = options.el.clientWidth;
			elHeight = options.el.clientHeight;


			if (options.direction == 'horizontal') {

				// jSlide
				slideStyle = {
					width: 100 / slides.length + '%',
					// transition: 'all ' + options.slideSpeed + 'ms ease-in-out'
				};

				if (options.includeArrows) {
					if (options.itemsize !== 'auto') {
						itemwidth = options.itemsize;
						arrowwidth = 35;
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
							templeft = -((cloneLeft - options.offset) * 100 / options.visEl) + '%';
						} else {
							templeft = '0%';
						}

						// jSlider
						sliderStyle = {
							transition: 'all ' + options.slideSpeed + 'ms ease-in-out',
							width: itemwidth * slides.length + 1 + 'px',
							height: '100%',
							transform: 'translate3d(' + templeft + ',0,0)',
							webkitTransform: 'translate3d(' + templeft + ',0,0)'
						};

						options.ctrlN[0].style.width = arrowStyle.width;
						options.ctrlP[0].style.width = arrowStyle.width;
					} else {
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
							templeft = -((cloneLeft - options.offset) * 100 / options.visEl) + '%';
						} else {
							templeft = '0%';
						}

						// jSlider
						sliderStyle = {
							transition: 'all ' + options.slideSpeed + 'ms ease-in-out',
							width: (slides.length * 100) / options.visEl + '%',
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
						templeft = -((cloneLeft - options.offset) * 100 / slides.length) + '%';
					} else {
						templeft = '0%';
					}

					if (options.offset > 0 && options.visEl > 1 && !options.carousel) {
						templeft = ((options.current + options.offset) * 100 / slides.length) + '%';
					}

					// jSlider
					sliderStyle = {
						transition: 'all ' + options.slideSpeed + 'ms ease-in-out',
						width: (slides.length * 100) / options.visEl + '%',
						height: '100%',
						transform: 'translate3d(' + templeft + ',0,0)',
						webkitTransform: 'translate3d(' + templeft + ',0,0)'
					};
				}

			} else {
				// jSlider
				sliderStyle = {
					transition: 'all ' + options.slideSpeed + 'ms ease-in-out',
					width: '100%',
					height: slides.length * 100 + '%',
					top: '0%'
				};
				// jSlide
				slideStyle = {
					width: '100%',
					height: 100 / slides.length + '%'
				};
			}

			options.sliderStyle = sliderStyle;
			options.wrapperStyle = wrapperStyle;
			options.arrowStyle = arrowStyle;

			extendOptions(options.slideWrapper[0].style, wrapperStyle, 'style');
			extendOptions(options.slider[0].style, sliderStyle, 'style');

			for (var i = 0; i < slides.length; i++) {
				extendOptions(slides[i].style, slideStyle, 'style');
			}

		};

		resizeListener = function(options) {
			window.addEventListener('resize', function() {
				self._buildLayout(options);
				slide(undefined, options);
			});
		};

		initListeners = function(options) {
			// resize Listener			
			if (options.responsive === true && options.carousel !== true) {
				resizeListener(options);
			}

			// ctrl listeners
			if (options.arrowCtrl !== false) {
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
						if (ev.keyCode == 39) {
							self.next();
						} else if (ev.keyCode == 37) {
							self.prev();
						}
					}
				});
			}
		};

		// ---------
		// destroy - kill
		this.destroy = function() {

		};

		// ---------
		// rebuild 
		this.rebuild = function() {
			this._buildLayout(this.options);
		};

		// ---------
		// next 
		this.next = function() {
			if (!this.options.currentlySliding) {
				slide('next', this.options);
			}
		};

		this.currentlySliding = function(){
			return this.options.currentlySliding;
		}

		// ---------
		// prev 
		this.prev = function() {
			if (!this.options.currentlySliding) {
				slide('prev', this.options);
			}
		};


		// ---------
		// pause 
		this.pause = function() {
			if (!this.options.currentlySliding) {
				this.options.pause = true;
			}
		};

		// ---------
		// active element 
		this.activeEl = function() {
			return this.options.current;
		};

		// ---------
		// prev
		slide = function(direction, options) {
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
							if (options.current < slides.length) {
								options.ctrlN[0].classList.remove('disabled');
							}
						}
						options.current--;
					} else {
						if (options.replay) {
							options.current = slides.length - 1;
						} else {
							options.ctrlN[0].classList.remove('disabled');
							options.ctrlP[0].classList.add('disabled');
						}
					}
					if (options.replay) {
						if (options.current >= slides.length - options.visEl + 1) {
							options.current = slides.length - options.visEl;
						}
					}

					if (options.carousel) {
						if (options.current <= 0) {

							// after 700ms, because 600 is the animation length for the default slide
							// behavior
							window.setTimeout(function() {
								options.slider[0].style.transition = 'none';
								options.current = options.trueSlideLength;

								if (options.itemsize !== 'auto') {
									slideAmount = -(options.current * options.itemsize) + 'px';
								} else {
									slideAmount = -(options.current * 100 / slides.length) + '%';
								}

								for (var i = 0; i < slides.length; i++) {
									slides[i].classList.remove('active');
								}

								slides[options.current + options.offset].classList.add('jump');
								slides[options.current + options.offset].classList.add('active');

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
										options.slider[0].style.transition = 'all ' + options.slideSpeed + 'ms ease-in-out';
										slides[options.current + options.offset].classList.remove('jump');
									}
								}, 40);

							}, 700);
						}
					}

				} else {
					if (options.current < slides.length - 1) {
						options.current++;
						if (!options.replay) {
							options.ctrlP[0].classList.remove('disabled');

							if (!options.scrollToEnd) {
								if (options.current == slides.length - options.visEl - 1) {
									options.ctrlN[0].classList.add('disabled');
								}
							} else {
								if (options.current == slides.length - options.offset) {
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
						if (options.current >= slides.length - options.visEl + 1) {
							options.current = 0;
						}
					}

					if (options.carousel) {
						if (options.offset > 0 && options.visEl > 1) {
							conditions = options.current >= options.trueSlideLength + options.offset;
						} else {
							conditions = options.current > options.trueSlideLength + options.offset;
						}

						if (conditions === true) {

							// after 700ms, because 600 is the animation length for the default slide
							// behavior
							window.setTimeout(function() {
								options.slider[0].style.transition = 'none';
								options.current = 1;
								if (options.itemsize !== 'auto') {
									slideAmount = -(options.current * options.itemsize) + 'px';
								} else {
									slideAmount = -(options.current * 100 / slides.length) + '%';
								}

								for (var i = 0; i < slides.length; i++) {
									slides[i].classList.remove('active');
								}

								slides[options.current + options.offset].classList.add('jump');
								slides[options.current + options.offset].classList.add('active');

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
										options.slider[0].style.transition = 'all ' + options.slideSpeed + 'ms ease-in-out';
										slides[options.current + options.offset].classList.remove('jump');
									}
								}, 40);

							}, 700);


						}
					}

				}

			}

			if (options.itemsize !== 'auto') {
				slideAmount = -(options.current * options.itemsize) + 'px';
			} else {
				slideAmount = -(options.current * 100 / slides.length) + '%';
			}
			if (options.offset > 0 && options.visEl > 1 && !options.carousel) {
				slideAmount = -((options.current - options.offset) * 100 / slides.length) + '%';
			}

			for (var i = 0; i < slides.length; i++) {
				slides[i].classList.remove('active');
			}
			if (slides && slides[options.current]) {
				if(!options.carousel){
					slides[options.current].classList.add('active');
				} else {
					slides[options.current + options.offset].classList.add('active');

				}
			}
			if (options.slider[0]) {
				if (options.direction == 'horizontal') {
					options.slider[0].style.transform = 'translate3d(' + slideAmount + ',0,0)';
					options.slider[0].style.webkitTransform = 'translate3d(' + slideAmount + ',0,0)';
				} else {
					options.slider[0].style.top = -slideAmount + '%';
				}
			}
			window.setTimeout(function() {
				options.currentlySliding = false;
			}, options.slideSpeed);
		};
	};

	// classList polyfill for ie < 10 by devongovett
	if (!("classList" in document.createElement("_"))) {
		Object.defineProperty(HTMLElement.prototype, 'classList', {
			get: function() {
				var self = this;

				function update(fn) {
					return function(value) {
						classes = self.className.split(/\s+/),
							index = classes.indexOf(value);

						fn(classes, index, value);
						self.className = classes.join(" ");
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
