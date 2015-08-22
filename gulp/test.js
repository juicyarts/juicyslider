/**
 * Test automations
 * This File runs Tests and Coverage over all source Files that are customized by
 * the developer
 * Istanbul is used as our coverage tool
 * Mocha is our test runner
 * Gutil Logs the current state
 */

var gulp = require('gulp'),
	karma = require('gulp-karma'),
	plato = require('plato'),
	gutil = require('gulp-util');

/*
	Runs unit Test
 */
gulp.task('unit:js', function() {
	return gulp.src([
		'./src/js/juicySlider.js', 
		'./test/unit/**/*.js'
		])
		.pipe(karma({
			configFile: 'karma.conf.js'
		}))
		.on('error', function(err) {
			gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('karma had errors', err));
		})
});


gulp.task('test', ['unit:js']);

/*
	Creates Complexity Analysis for javascript Files
 */
gulp.task('analyse:js', function() {
	plato.inspect(['./src/js/**/*.js'], './coverage/plato', {}, function(report) {
		gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('plato report done'));
	});
});