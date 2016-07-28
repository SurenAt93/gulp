'use strict';

const gulp        = require('gulp');
const sourcemaps  = require('gulp-sourcemaps');
const stylus      = require('gulp-stylus');
const concat      = require('gulp-concat');
const debug       = require('gulp-debug');
const gulpIf      = require('gulp-if');
const newer       = require('gulp-newer');
const del         = require('del');
const browserSync = require('browser-sync').create();
const notify      = require('gulp-notify');
const combiner    = require('stream-combiner2').obj;

const isDevelopment   = !process.env.NODE_ENV ||
                         process.env.NODE_ENV == 'development';

gulp
  .task(
    'styles',
    function() {
      return gulp
              .src('frontend/**/*.styl')
              .pipe(debug({title: 'styles:src'}))
              .pipe(gulpIf(isDevelopment, sourcemaps.init()))
              .pipe(stylus())
              .pipe(debug({title: 'styles:stylus'}))
              .pipe(concat('main.css'))
              .pipe(gulpIf(isDevelopment, sourcemaps.write()))
              .pipe(debug({title: 'styles:concat'}))
              .pipe(gulp.dest('public'));
    }
  );

gulp
  .task(
    'clean',
    function() {
      return del('public');
    }
  );

gulp
  .task(
    'assets',
    function() {
      return gulp
              .src('frontend/assets/**', {since: gulp.lastRun('assets')})
              .pipe(newer('public'))
              .pipe(debug({title: 'assets:src'}))
              .pipe(gulp.dest('public'));
    }
  );

gulp
  .task(
    'build',
    gulp.series(
      'clean',
      gulp.parallel(
        'styles',
        'assets'
      )
    )
  );

gulp
  .task(
    'watch',
    function() {
      gulp
        .watch(
          'frontend/styles/**/*.*',
          gulp
            .series('styles'));

      gulp
        .watch(
          'frontend/assets/**/*.*',
          gulp
            .series('assets'));
    }
  );

gulp
  .task(
    'serve',
    function() {
      browserSync.init({
        server: 'public'
      });

      browserSync
        .watch('public/**/*.*')
        .on('change', browserSync.reload);
    }
  );
  
gulp
  .task(
    'dev',
    gulp
      .series('build',
        gulp
          .parallel('watch', 'serve')
      )
  );




  // combiner
  //     
  //     
  //     