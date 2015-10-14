/**
 * Test automations
 * This File runs Tests and Coverage over all source Files that are customized by
 * the developer
 * Istanbul is used as our coverage tool
 * Mocha is our test runner
 * Gutil Logs the current state
 */
'use strict';

var gulp = require('gulp'),
	karma = require('karma').Server,
	gulpkarma = require('gulp-karma'),
	plato = require('plato'),
	gutil = require('gulp-util'),
	confFile = require('../karma.conf.js');



gulp.task('test:unit:watch', function() {
	return gulp.src([
			'./src/js/juicySlider.js',
			'./test/unit/**/*.js'
		])
		.pipe(gulpkarma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('karma had errors', err));
		});
});


gulp.task('test:unit:run', function() {
	return gulp.src([
			'./src/js/juicySlider.js',
			'./test/unit/**/*.js'
		])
		.pipe(gulpkarma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('karma had errors', err));
		});
});

gulp.task('test:unit:build', function() {
	return gulp.src([
			'./lib/juicySlider.min.js',
			'./test/unit/**/*.js'
		])
		.pipe(gulpkarma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('karma had errors', err));
		});
});


gulp.task('test', ['test:unit:run']);

/*
	Creates Complexity Analysis for javascript Files
 */
gulp.task('analyse:js', function() {
	plato.inspect(['./src/js/**/*.js'], './coverage/plato', {}, function(report) {
		gutil.log(gutil.colors.red(' -- Att-M-Dev -- '), gutil.colors.green('plato report done'));
	});
});