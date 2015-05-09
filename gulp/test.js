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
	shell = require('gulp-shell');

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
			throw err;
		})
});

gulp.task('coveralls', ['unit:js'], function() { // 2nd arg is a dependency: 'karma' must be finished first.  
	// Send results of istanbul's test coverage to coveralls.io.
	return gulp.src('./gulpfile.js', {
			read: false
		}) // You have to give it a file, but you don't have to read it.
		.pipe(shell('cat ./coverage/**/lcov.info | ./node_modules/coveralls/bin/coveralls.js'));
});


gulp.task('test', ['unit:js', 'coveralls'])

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