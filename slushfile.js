'use strict';

var gulp = require('gulp')
  , gutil = require('gulp-util')
  , install = require('gulp-install')
  , conflict = require('gulp-conflict')
  , template = require('gulp-template')
  , __ = require('underscore.string')
  , inquirer = require('inquirer');

gulp.task('default', function (done) {

  inquirer.prompt([
    {
      type: 'input', 
      name: 'projectName', 
      message: 'What\'s the name of your project?',
      default: gulp.args.join(' ')
    }
  ], function (answers) {

    answers.projectName = __.slugify(answers.projectName);
    
    // first process the templates and then copy over binary files
    // because it seems that the template and conflict functions
    // might fuck up the original files
    //
    // https://github.com/lazd/gulp-replace/issues/6
    
    function copyAssets() {
      gulp.src(__dirname + '/templates/assets/**')
        .pipe(gulp.dest('./src/assets/'))
        .on('end', function () {
          done();
        })
        .on('error', function () {
          gutil.log();
        });
    }

    gulp.src(__dirname + '/templates/app/**', { dot: true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', function () {
        copyAssets();
      })
      .on('error', function () {
        gutil.log();
      });

  });
});
