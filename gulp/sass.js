var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('prefixCss', function() {
	return gulp.src('./src/css/base.css')
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(gulp.dest('./src/css/'));
});

gulp.task('sass', function() {
	return sass('./src/css/base.sass')
	.on('error', function(err){
		console.error('Error!: ', err.message);
	})
	.pipe(gulp.dest('./src/css'));
});