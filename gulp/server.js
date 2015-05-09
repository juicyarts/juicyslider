/** 
 * This File contains the tasks to serve the project localy
 * nodemon restarts the node server
 * browsersyn reload the browser
 */

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	gutil = require('gulp-util');

gulp.task('nodemon', function(cb) {
	var called = false;
	return nodemon({
			script: 'server.js',
			watch: ['server.js']
		})
		.on('start', function onStart() {
			if (!called) {
				cb();
			}
			called = true;
		})
		.on('restart', function onRestart() {
			setTimeout(function reload() {
				browserSync.reload({
					stream: false
				});
			}, 500);
		});
});


gulp.task('browsersync', ['nodemon'], function() {
	browserSync.init({
		files: ['./src/**/*'],
		proxy: 'http://localhost:3337',
		browser: ['google chrome'],
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: true
		}
	});
});