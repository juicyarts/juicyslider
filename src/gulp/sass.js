var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('prefixCss', function() {
	return gulp.src('./src/css/base.css')
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(gulp.dest('./src/css/'));
});
gulp.task('sass', function() {
	gulp.src('./src/**/*.sass')
		.pipe(sass({
			debugInfo: true,
			style: 'compressed'
		}))
		.pipe(gulp.dest('./src/css'));
});