'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	closureCompiler = require('gulp-closure-compiler');


gulp.task('make', ['compile'], function() {
	return gulp.src('./lib/juicySlider.js')
		.pipe(uglify({
			compress: {
				drop_console: true
			},
		}))
		.pipe(rename('juicySlider.min.js'))
		.pipe(gulp.dest('./lib'))
});

gulp.task('compile', function() {
	return gulp.src('./src/js/juicySlider.js')
		.pipe(closureCompiler({
			compilerPath: './node_modules/closure-compiler-jar/compiler.jar',
			fileName: 'juicySlider.js'
		}))
		.pipe(gulp.dest('./lib'))
});;