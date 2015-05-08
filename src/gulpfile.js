// gulpfile.js
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	stripDebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),
	closureCompiler = require('gulp-closure-compiler'),
	requireDir = require('require-dir'),
	dir = requireDir('./gulp',  {recurse: true});

gulp.task('prefixCss', function() {
	return gulp.src('./src/css/base.css')
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(gulp.dest('./src/css/'));
})

gulp.task('lint', function() {
	gulp.src(['./src/**/*.js', './test/**/*.js', '!./src/**/**.min.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function() {
	gulp.src('./src/**/*.sass')
		.pipe(sass({
			debugInfo: true,
			style:'compressed'
		}))
		.pipe(gulp.dest('./src/css'));
});

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