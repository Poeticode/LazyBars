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
var File = require('vinyl');
var fs = require('fs');
var data = require('gulp-data');
var glob = require("glob")
var gutil = require('gulp-util');
var babel = require('gulp-babel');

var paths = {};

/* SCSS/CSS files */
paths.css = '_src/scss/app/**/*.scss';
paths.cssVendor = '_src/scss/vendor/**/*.css';

/* Javascript files */
paths.js = '_src/js/app/**/*.js';
paths.jsVendor = '_src/js/vendor/**/*.js';

/* Handlebar templating files */
paths.hbs = '_src/hbs/*.html';
paths.partials = '_src/hbs/partials/**/*.hbs';
paths.helpers = '_src/hbs/helpers/*.js';
paths.data = '_src/hbs/data/**/*.{js,json}';

/* Miscellaneous files */
paths.app = '_src/js/app/app.js';
paths.dest = '/Applications/XAMPP/xamppfiles/htdocs';

/**
 * Create dynamic pages based on JSON files in our /hbs/data/dynamic directory
 */
gulp.task('createDynamicPages', function createDynamicPages(done) {
    var tasks = [];

    // Go through each JSON file in our special directory
    glob.sync("_src/hbs/data/dynamic/*.json").forEach(function(filePath) {
        // Read it as a JSON object
        var jsonFile = JSON.parse(fs.readFileSync(filePath));

        // They should all be arrays, so iterate over them
        jsonFile.forEach(function(fileData) {
            // create a file for each one, using the template + filename they specify
            var hbStream = hb()
                .partials(paths.partials)
                .helpers(paths.helpers)
                .data(paths.data);

            var currentTask = gulp.src("_src/hbs/partials/" + fileData.partialsName + ".hbs")
                .pipe(data( function(file) { 
                    return fileData
                }))
                .pipe(hbStream)
                .pipe(rename({
                    basename: fileData.slug,
                    extname: '.html'
                }))
                .pipe(gulp.dest(paths.dest + "/" + fileData.dest))
                .pipe(gulp.dest('dist/' + fileData.dest))
                .pipe(livereload());
            tasks.push(currentTask);
        });
    });
    return merge(tasks);
});

/**
 * ES6 -> ES5 -> Uglified
 */
gulp.task('scripts', function(done) {

    var vendorTask = gulp.src([
        './node_modules/three/build/three.min.js',
        '_src/js/vendor/jsoneditor.js'
    ]);

    var appTask = browserify({entries: paths.app, debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({mangle: true}));

    return merge(vendorTask, appTask)
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.dest+'/js'))
        .pipe(gulp.dest('dist/js/'))
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
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload());
});

/**
 * Regular Handlebar stuff, should be self-evident
 */
gulp.task('handlebars', function (done) {
    // get all them handlebars data for all of our streams
    var hbStream = hb()
        .partials(paths.partials)
        .helpers(paths.helpers)
        .data(paths.data);
        
    // create the files for regular ol' templates
    gulp
        .src(paths.hbs)
        .pipe(hbStream)
        .pipe(gulp.dest(paths.dest))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
        .on('end', done);
    
});

/**
 * Upload to my server using the secret key
 */
gulp.task('upload', function () {
	return gulp.src(paths.dest+'/**/*')
		.pipe(sftp({
			host: 'lunenburg.dreamhost.com',
			auth: 'poetKey',
            remotePath: '/home/silastippens/beta.poeti.codes/'
		}));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch([paths.css, paths.cssVendor], ['sass']);
    gulp.watch([paths.js, paths.jsVendor], ['scripts']);
    gulp.watch([paths.hbs, paths.partials, paths.data, paths.helpers], ['handlebars', 'createDynamicPages']);
});