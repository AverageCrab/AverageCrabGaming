var gulp  = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pixrem = require('gulp-pixrem');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var join = require('path').join;

var config = require('./config');
var vendor_packages = config.vendor_packages;



gulp.task('vendor', function(){
  vendor_packages.forEach(browserifyVendor);
  gutil.log('Vendor Packages built.');
  gutil.log('Please rebuild the other bundles, and restart the webserver');
})

gulp.task('watch', function(){
  bundle('public').watch();
  livereload.listen(35729);
})

gulp.task('build', function(){
  bundle('public').build();
})





// build pipeline for browserify vendor packages
function browserifyVendor(name){
  var path = join(__dirname, '/node_modules/' + name);
  var pkg = require(join(path, 'package.json'));
  var main = pkg.main ? join(path, pkg.main) : join(path, 'index.js');
  var version = pkg.version;

  var b = browserify();
  b.require(main, {expose: name});

  b.bundle()
    .pipe(source(main))
    .on('error', gutil.log)
    .pipe(rename(name + '-' + version + '.js'))
    .pipe(gulp.dest('./build/vendor/'));

  gutil.log('built vendor %s', name)
}

// setup watch/build pipelines for a given
// bundle in client/
function bundle(name){
  var path = 'client/' + name + '/index';
  var js = path + '.js';
  var css = path + '.css';
  var scss = path + '.scss';
  var dest = 'build/bundles/' + name;
  var assets_source = 'client/common/branding/assets';
  var assets_destination = dest + '/assets';

  function build(){
    // browserify
    browserifyFile(js, dest);
    // sass
    sassFile(scss, dest);
    //assets
    assets(assets_source, assets_destination);
  }

  function watch(){
    // browserify
    browserifyFile(js, dest, {watch:true});

    // sass
    sassFile(scss, dest)
    gulp.watch('client/' + name + '/**/*.scss', function(){
      return sassFile(scss, dest, {watch:true});
    });
  }

  return {
    build: build,
    watch: watch
  }
}


// build pipeline for browserify app bundle
function browserifyFile(src, dest, opts){
  opts = opts || {};

  var b = browserify({
    entries: join(__dirname, src),
    debug: true,
    transform: [
      ['jadeify'],
      ['browserify-ngannotate']
    ]
  });

  function update(){
    var stream = b.bundle()
      .on('error', gutil.log)
      .pipe(source(src))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(rename('index.js'))

    if (opts.uglify) {
      stream = stream.pipe(uglify());
    }

    if (opts.watch) {
      stream = stream.pipe(livereload());
    }

    stream
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest));

    gutil.log('built browserify %s', src)
  }

  if (opts.watch) {
    b = watchify(b);
    b.on('update', update);
    b.on('log', gutil.log);
  }

  b.external(vendor_packages);
  update();
}

// pipeline for a sass file
function sassFile(src, dest, opts){
  opts = opts || {};

  var stream = gulp.src(src)
    .pipe(sourcemaps.init({debug:true}))
    .on('error', gutil.log)
    .pipe(sass())
    .pipe(pixrem())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))

  if (opts.watch) {
    stream = stream.pipe(livereload());
  }

  stream
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));

  gutil.log('built sass %s', src)
}

function assets(src,dest) {
  console.log('dest',dest);
  gulp.src([src + '/**/*']).pipe(gulp.dest(dest));
}