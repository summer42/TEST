var gulp = require('gulp');
const changed = require('gulp-changed');
var htmlhint = require("gulp-htmlhint");
var plumber = require('gulp-plumber');


const DEST= 'dist';

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*',
  html:'*.html'
};

gulp.task('watch', function() {
    //启动时检测
    gulp.src(paths.html)
            .pipe(plumber())
            .pipe(htmlhint('.htmlhintrc'))
            .pipe(htmlhint.failReporter())
    
    //文件改动时检测
    var watcher = gulp.watch(paths.html, []);
    watcher.on('change', function(event) {
        gulp.src(paths.html)
            .pipe(plumber())
            .pipe(htmlhint('.htmlhintrc'))
            .pipe(htmlhint.failReporter())
    });
});

