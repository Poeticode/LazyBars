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
var streamArray = require('stream-array');
var through = require('through2');
var File = require('vinyl');
var fs = require('fs');


var paths = {};

/* SCSS/CSS files */
paths.css = '_src/scss/app/**/*.scss';
paths.cssVendor = '_src/scss/vendor/**/*.css';

/* Javascript files */
paths.js = '_src/js/app/**/*.js';
paths.jsVendor = '_src/js/vendor/**/*.js';

/* Handlebar templating files */
paths.hbs = '_src/hbs/**/*.html';
paths.partials = '_src/hbs/partials/**/*.hbs';
paths.helpers = '_src/hbs/helpers/*.js';
paths.data = '_src/hbs/data/**/*.{js,json}';

/* Miscellaneous files */
paths.app = '_src/js/app/app.js';
paths.dest = '/Applications/XAMPP/xamppfiles/htdocs';

var posts = JSON.parse(fs.readFileSync('_src/hbs/data/posts.json'));

// gulp
//         .src('_src/hbs/data/posts.json')
//         .pipe(through.obj(function (file, enc, cb) {
//             var name = path.parse(file.path).name;
//             var data = JSON.parse(String(file.contents));

gulp.task('createPosts', createPosts);

function createPosts() {

    return streamArray(posts.posts)
        .pipe(through.obj(function (post, enc, cb) {
            // var file = new File({
            //     path: post.slug + '.html',
            //     contents: new Buffer('{{post}}'),
            //     data: post,
            // });
            // this.push(file);
            // cb();
            var hbStream = hb()
                .partials(paths.partials)
                .helpers(paths.helpers)
                .data(paths.data);

            gulp
                .src('_src/hbs/partials/post.hbs')
                .pipe(hbStream)
                .pipe(rename({
                    basename: post.slug,
                    extname: '.html',
                }))
                .pipe(gulp.dest(paths.dest + '/posts/'))
                .pipe(gulp.dest('dist/posts/'))
                .on('error', cb)
                .on('end', cb);
        }))


}



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
    gulp.watch([paths.hbs, paths.partials, paths.data, paths.helpers], ['handlebars', 'createPosts']);
});