const gulp = require('gulp');
const browserSync = require('browser-sync').create();
// const less = require('gulp-less');
const scss = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const del = require('del');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const spritesmith = require('gulp.spritesmith');
const rename = require('gulp-rename');
const babel = require('gulp-babel');


gulp.task('clean:dist', function() {
    return del('./dist');
});

gulp.task('server',  function() {
    browserSync.init({
    	server: {baseDir: './dist/'}
    });

    gulp.watch('app/template/**/*.*', ['pug']);
    // gulp.watch('app/styles/**/*.less', ['less']);
    gulp.watch('app/styles/**/*.scss', ['scss']);
    gulp.watch('app/js/**/*.js', ['copy:js']);
    gulp.watch('app/libs/**/*.*', ['copy:libs']);
    gulp.watch('app/fonts/**/*.*', ['copy:fonts']);
    gulp.watch('app/img/**/*.*', ['copy:img']);
});

gulp.task('copy:js', function() {
    return gulp.src([ //тут должен быть строгий порядок файлов
            'app/js/main.js'
        ])
    	.pipe(sourcemaps.init())
    	.pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
    	.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
});

gulp.task('copy:libs', function() {
    return gulp.src('app/libs/**/*.*')
    	.pipe(gulp.dest('./dist/libs'))
		.pipe(browserSync.stream());
});

gulp.task('copy:fonts', function() {
    return gulp.src('app/fonts/**/*.*')
    	.pipe(gulp.dest('./dist/fonts'))
		.pipe(browserSync.stream());
});

gulp.task('sprite', function(callback) {
  const spriteData = gulp.src('app/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('dist/images/'));
  spriteData.css.pipe(gulp.dest('app/styles/global/'));
  callback();
});

gulp.task('copy:img', ['sprite'], function() {
    return gulp.src('app/images/**/*.*')
    	.pipe(gulp.dest('./dist/images'))
		.pipe(browserSync.stream());
});

// gulp.task('less', function() {
//     return gulp.src('./app/styles/main.less')
// 	    .pipe(plumber({
// 	    	errorHandler: notify.onError(function(err){
// 	    		return {
// 	    			title: 'Styles',
// 	    			message: err.message
// 	    		}
// 	    	})
// 	    }))
// 	    .pipe(sourcemaps.init())
//     	.pipe(less())
//     	.pipe( autoprefixer({
//     		browsers: ['last 6 versions'],
//     		cascade: false
//     	}) )
// 	    .pipe(sourcemaps.write())
//     	.pipe(gulp.dest('./dist/css'))
//     	.pipe(browserSync.stream());
// });

gulp.task('scss', function() {
    return gulp.src('./app/styles/main.scss')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Styles',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(sourcemaps.init())
	    .pipe(scss())
	    .pipe(autoprefixer({
				browsers : ['> 2%'],
				cascade : false
			}))
	    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
	    .pipe(rename('main.min.css'))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./dist/css'))
	    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
    return gulp.src('./app/template/*.pug')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Pug',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(pug({
	    	pretty: true
	    }))
	    .pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
});

gulp.task('default', function(callback){
	runSequence(
		'clean:dist',
		['scss', 'pug', 'copy:js', 'copy:libs', 'copy:fonts', 'copy:img' ],
		// 'server',
		callback
	)
});

