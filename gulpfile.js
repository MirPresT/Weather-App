var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// SASS SCSS
gulp.task('scss')

// browserSync
gulp.task('browserSync',[],function(){
  browserSync.init({
    server:{
      baseDir: './'
    }
  });
});



// default sequence when typing gulp command
gulp.task('default',['browserSync']);
