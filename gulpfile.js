var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
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

// browserSync
gulp.task('browserSync',['watch'],function(){
  browserSync.init({
    server:{
      baseDir: './'
    }
  });
});


// watch file changes
gulp.task('watch', ['scss'], function() {
  gulp.watch('src/assets/stylesheets/**/*.scss', ['scss']);
});

// default sequence when typing gulp command
gulp.task('default',['scss','watch','browserSync']);
