var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var hb = require('gulp-hb');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var livereload  = require('gulp-livereload');
var sftp = require('gulp-sftp');

var paths = {};

/* SCSS/CSS files */
paths.css = './_src/scss/app/*.scss';
paths.cssVendor = './_src/scss/vendor/*.css';

/* Javascript files */
paths.js = './_src/js/app/*.js';
paths.jsVendor = './_src/js/vendor/*.js';

/* Handlebar templating files */
paths.hbs = './_src/hbs/*.html';
paths.partials = './_src/hbs/partials/**/*.hbs';
paths.helpers = './_src/hbs/helpers/*.js';
paths.data = './_src/hbs/data/**/*.{js,json}';

/* Miscellaneous files */
paths.app = './_src/js/app/app.js';
paths.dest = './dist';

/**
 * ES6 -> ES5 -> Uglified
 */
gulp.task('scripts', function(done) {
    return browserify({entries: paths.app, debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({mangle: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.dest+'/js'))
        .pipe(livereload());
});

/**
 * SASS -> CSS, then concat vendor css & minify
 */
gulp.task('sass', function() {
  var custom = gulp.src(paths.css)
    .pipe(sass())
    .on('error', sass.logError)
    
  var vendor = gulp.src(paths.cssVendor);
  
  return merge(custom, vendor)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.dest+'/css/'))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dest+'/css/'))
    .pipe(livereload());
});

/**
 * Handlebar stuff, should be self-evident
 */
gulp.task('handlebars', function (done) {
    var hbStream = hb()
        .partials(paths.partials)
        .helpers(paths.helpers)
        .data(paths.data);
        
    gulp
        .src(paths.hbs)
        .pipe(hbStream)
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload())
        .on('end', done);
});

/**
 * Upload to my server using the secret key
 */
gulp.task('upload', function () {
	return gulp.src('dist/**/*')
		.pipe(sftp({
			host: 'lunenburg.dreamhost.com',
			auth: 'poetKey',
            remotePath: '/home/silastippens/beta.poeti.codes/'
		}));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['scripts']);
    gulp.watch([paths.hbs, paths.partials, paths.data, paths.helpers], ['handlebars']);
});