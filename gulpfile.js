var gulp = require('gulp');
// var livereload = require('gulp-livereload');
var bs = require('browser-sync');

//path:images, css, js
var appDev = 'dev/';
var appProd = 'build/';

//path:html
var viewDev = 'dev/';
var viewProd = 'views/'

//compress:images
var imagemin = require('gulp-imagemin');

gulp.task('image', () => {
	gulp.src(appDev + 'img/*/*')
	    .pipe(imagemin())
	    .pipe(gulp.dest(appProd + 'img'));
});

//deal with css
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('css', () => {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano(),
    ];
    return gulp.src(appDev + 'css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(appProd + 'css'))
        .pipe(bs.stream());
});

//deal with js
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

gulp.task('es6', () => {
	return gulp.src(appDev + 'src/*.js')
	.pipe(plumber())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(uglify())
	.pipe(gulp.dest(appProd + 'src'))
  .pipe(bs.stream());
});

//jade => html
// var pug = require('gulp-pug');

// gulp.task('html', () => {
 
//   gulp.src(viewProd + '*.pug')
//     .pipe(plumber())
//     .pipe(pug({
//       pretty:true
//     }))
//     .pipe(gulp.dest(viewDev + 'html'))
// });

//livereload
// gulp.task('watch', () => {
  
//   gulp.watch(appDev + 'img/*', ['image']);
//   gulp.watch(viewProd + '*.jade', ['html']);
// });

// gulp.task('reload', () => {
//   livereload.listen();

//   gulp.watch(appDev + 'css/*.css', ['css']);
//   gulp.watch(appDev + 'src/*.js', ['es6']);
//   gulp.watch(appDev + 'img/*', ['image']);
//   gulp.watch(viewProd + '*.pug', ['html']);
// });

//browser-sync
gulp.task('serve', ['es6', 'css'], () => {
  bs.init({
    proxy: 'http://localhost:3000/index',
  });

  gulp.watch(appDev + 'css/*.css', ['css']);
  gulp.watch(appDev + 'src/*.js', ['es6']);
  gulp.watch(viewProd + '*.html').on('change', bs.reload);
});

//default task
gulp.task('default', ['serve', 'es6', 'css', 'image']);