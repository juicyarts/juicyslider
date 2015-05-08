module.exports = {
  "test Slider": function(browser) {
    browser.url("http://localhost:3000/src/templates/test.html")
      .waitForElementVisible('body', 1000)
      .assert.title("hsSlider.js")
      .assert.cssClassPresent("#testSlider", "jContainer")
      .assert.cssClassPresent("#testSlider", "sliderContainer")
      .assert.cssClassPresent("#testSlider ul", "jSlider")
      .assert.cssProperty("#testSlider ul", "transition", "all 0.8s ease-in-out 0s");
    
    browser.assert.cssClassPresent("#testSlider ul li.item-1", "active")
      .click('#next')
      .assert.cssClassPresent("#testSlider ul li.item-2", "active")
      .click('#next')
      .click('#next')
      .assert.cssClassPresent("#testSlider ul li.item-5", "active");
    browser.end();
  }
};
