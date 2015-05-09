// gulpfile.js
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	uglify = require('gulp-uglify'),
	closureCompiler = require('gulp-closure-compiler'),
	requireDir = require('require-dir'),
	dir = requireDir('./gulp',  {recurse: true});

gulp.task('watch', ['browsersync'], function() {
	gulp.watch(['./src/**/*.js', './src/**/*.html', './src/**/*.css'], ['lint'])
		.on('change', function() {
			console.log('files changed reoloading browser');
		});
});

gulp.task('makeJs', function() {
	gulp.src('./dist/hsSlider.build.js')
		.pipe(uglify({
				compress: {
					drop_console: true 
				}
			}
		))
		.pipe(gulp.dest('dist/min'))
});

gulp.task('make', function() {
	gulp.src('./src/js/hsSlider.js')
		.pipe(closureCompiler({
			compilerPath: './bower_components/closure-compiler/compiler.jar',
			fileName: 'hsSlider.build.js'
		}))
		.pipe(gulp.dest('dist'))
});;

gulp.task('default',['watch']);