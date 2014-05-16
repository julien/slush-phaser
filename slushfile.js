var gulp = require('gulp')
  , gutil = require('gulp-util')
  , install = require('gulp-install')
  , conflict = require('gulp-conflict')
  , template = require('gulp-template')
  , inquirer = require('inquirer');

gulp.task('default', function (done) {

  inquirer.prompt([{
    type: 'input', 
    name: 'projectName', 
    message: 'What\'s the name of your project?',
    default: gulp.args.join(' ')
  }, {
    type: 'confirm',
    name: 'moveon',
    message: 'Continue?'

  }], function (answers) {
  
    if (!answers.moveon) {
      return done();
    }

    gulp.src(__dirname + '/templates/app/**', { dot: true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', function () {
        done();
      })
      .on('error', function () {
        gutil.log();
      })
  });

});
