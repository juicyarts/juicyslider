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
	gutil = require('gulp-util'),
	runSequence = require('gulp-run-sequence');

/*
	Runs unit Test
 */
gulp.task('unit:js', function() {
	return gulp.src(['./src/js/**/*.js', './test/**/*.js'])
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}))
		.on('error', function() {
			throw err;
		})
});

/*
	Creates Complexity Analysis for javascript Files
 */
gulp.task('analyse:js', function() {
	plato.inspect(['./src/js/**/*.js', './test/**/*.js'], './dist/plato', {}, function(report) {
		gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('plato report done'));
	});
});

/*
	Minify Proccess
 */
gulp.task('minify:js', function() {
	plato.inspect(['./src/js/**/*.js'], './dist/plato', {}, function(report) {
		gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('plato report done'));
	});
});

