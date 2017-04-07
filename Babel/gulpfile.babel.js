import babelHelpers from './helper';
console.log(babelHelpers);
import gulp from 'gulp';
// import jshint from 'gulp-jshint';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import stripDebug from 'gulp-strip-debug';
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import ngAnnotate from 'gulp-ng-annotate';
import templatecache from 'gulp-angular-templatecache';
import useref from 'gulp-useref';
import gulpif from 'gulp-if';
import revReplace from 'gulp-rev-replace';
import cached from 'gulp-cached';
import preprocess from 'gulp-preprocess';
// import del from 'del';
import runSequence from 'run-sequence';
import { projectConfig } from './package.json';

// import 'babel-core/register'
// import 'babel/dist/external-helpers'
// var babelHelpers = require('helper');
const client = {
    "js": {
        "src": "source/**/*.js",
        "dist": "js/"
    }
};


/**
 * 将 options.src 的内容复制到 options.dist，没有内容则不生成目录。
 *
 * @param {Object} options 配置对象。
 * @param {string|array.<string>} options.src 源内容
 * @param {string} options.dist 输出目录
 */
const copy = ({ src, dist }) =>
    gulp.src(src)
        .pipe(gulp.dest(dist));

/**
 * 验证并转换前端 js。
 */
gulp.task('transpile', [],
    () => gulp.src(client.js.src)
        .pipe(cached('transpile'))
        .pipe(babel({
            "presets": [
                "es2015"
            ],
            "plugins": [
                "external-helpers"
            ]
        }))
        .pipe(preprocess({
            context: {
                NODE_ENV: 'development'
            }
        }))
        .on('error', function (e) {
            console.log([
                '-----------transpile error-----------\n',
                e.name,
                ': ',
                e.message,
                '\n',
                e.codeFrame,
                '\n',
                '-----------transpile error-----------'
            ].join(''));
            this.emit('end');
        })
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(gulp.dest(client.js.dist))
);

/**
 * watch transpile。
 */
gulp.task('watch', ['transpile'], () => {
    /*var watcher = */gulp.watch(client.js.src, ['transpile']);
    // gulp.watch(client.template.src, ['partial-html']);
    // watcher.on('change', function(event) {
    //     console.log('File ' + event.path + ' was ' + event.type + '.');
    // });
});

gulp.task('default', ['watch']);
