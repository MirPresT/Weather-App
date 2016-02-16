var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync').create();


// SASS SCSS
gulp.task('scss', function(){
  gulp.src('src/assets/stylesheets/main.scss',{base:'src'})
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.stream());
})

// webpack task
gulp.task('webpack', function(){
  gulp.src('src/assets/javascripts/entry.js',{base:'src'})
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest('dist/assets/javascripts/'))
  .pipe(browserSync.stream());
})

// browserSync
gulp.task('browserSync',['watch'],function(){
  browserSync.init({
    server:{
      baseDir: './'
    },
    open: false
  });
});
// browserSync
gulp.task('reload',function(){
  browserSync.reload();
});


// watch file changes
gulp.task('watch', ['scss'], function() {
  gulp.watch('src/assets/javascripts/*.js', ['webpack']);
  gulp.watch('src/assets/stylesheets/**/*.scss', ['scss']);
});

// default sequence when typing gulp command
gulp.task('default',['webpack','scss','watch','browserSync']);
