// gulpfile.js
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	requireDir = require('require-dir'),
	dir = requireDir('./gulp',  {recurse: true});

gulp.task('watch', ['browsersync'], function() {
	gulp.watch(['./src/**/*.js', './src/**/*.html', './src/css/**/*.sass'], ['lint', 'sass'])
		.on('change', function() {
			console.log('files changed reoloading browser');
		});
});

gulp.task('default',['watch']);
gulp.task('build',['make']);