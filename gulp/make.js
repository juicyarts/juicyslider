var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	closureCompiler = require('gulp-closure-compiler');


gulp.task('make', ['compile'], function() {
	gulp.src('./lib/juicySlider.js')
		.pipe(uglify({
			compress: {
				drop_console: true
			},
		}))
		.pipe(rename('juicySlider.min.js'))
		.pipe(gulp.dest('./lib'))
});

gulp.task('compile', function() {
	gulp.src('./src/js/juicySlider.js')
		.pipe(closureCompiler({
			compilerPath: './node_modules/closure-compiler/lib/vendor/compiler.jar',
			fileName: 'juicySlider.js'
		}))
		.pipe(gulp.dest('./lib'))
});;