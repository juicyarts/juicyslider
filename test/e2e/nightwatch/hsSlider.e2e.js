module.exports = {
  "test Slider": function(browser) {
    browser.url("http://juicyarts.github.io/juicyslider/")
      .waitForElementVisible('body', 1000)
      .assert.title("juicySlider.js")
      .assert.cssClassPresent("#slider1Container", "jContainer")
      .assert.cssClassPresent("#slider1Container", "sliderContainer")
      .assert.cssClassPresent("#slider1Container ul", "jSlider")
      .assert.cssProperty("#slider1Container ul", "transition", "all 0.6s ease-in-out 0s")

      .assert.cssClassPresent("#slider1Container ul li:first-child", "active")
      .click('#slider1Next')
      .assert.cssClassPresent("#slider1Container ul li:nth-child(2)", "active")
      .pause(1000)
      .click('#slider1Next')
      .assert.cssClassPresent("#slider1Container ul li:nth-child(3)", "active")
      .pause(1000)
      .click('#slider1Prev')
      .assert.cssClassPresent("#slider1Container ul li:nth-child(2)", "active")
      .pause(1000)
      .click('#slider1Prev')
      .assert.cssClassPresent("#slider1Container ul li:nth-child(1)", "active")
      .pause(1000)
      .click('#slider1Next')
      .assert.cssClassPresent("#slider1Container ul li:nth-child(2)", "active")
      .end();
  }
};
