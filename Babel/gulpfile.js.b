'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpUglify = require('gulp-uglify');

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpStripDebug = require('gulp-strip-debug');

var _gulpStripDebug2 = _interopRequireDefault(_gulpStripDebug);

var _gulpCssnano = require('gulp-cssnano');

var _gulpCssnano2 = _interopRequireDefault(_gulpCssnano);

var _gulpRev = require('gulp-rev');

var _gulpRev2 = _interopRequireDefault(_gulpRev);

var _gulpRevCollector = require('gulp-rev-collector');

var _gulpRevCollector2 = _interopRequireDefault(_gulpRevCollector);

var _gulpNgAnnotate = require('gulp-ng-annotate');

var _gulpNgAnnotate2 = _interopRequireDefault(_gulpNgAnnotate);

var _gulpAngularTemplatecache = require('gulp-angular-templatecache');

var _gulpAngularTemplatecache2 = _interopRequireDefault(_gulpAngularTemplatecache);

var _gulpUseref = require('gulp-useref');

var _gulpUseref2 = _interopRequireDefault(_gulpUseref);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpRevReplace = require('gulp-rev-replace');

var _gulpRevReplace2 = _interopRequireDefault(_gulpRevReplace);

var _gulpCached = require('gulp-cached');

var _gulpCached2 = _interopRequireDefault(_gulpCached);

var _gulpPreprocess = require('gulp-preprocess');

var _gulpPreprocess2 = _interopRequireDefault(_gulpPreprocess);

var _runSequence = require('run-sequence');

var _runSequence2 = _interopRequireDefault(_runSequence);

var _package = require('./package.json');

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'babel-core/register'
// import 'babel/dist/external-helpers'
// var babelHelpers = require('helper');

// import jshint from 'gulp-jshint';
var client = {
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

// import del from 'del';
var copy = function copy(_ref) {
    var src = _ref.src,
        dist = _ref.dist;
    return _gulp2.default.src(src).pipe(_gulp2.default.dest(dist));
};

/**
 * 验证并转换前端 js。
 */
_gulp2.default.task('transpile', [], function () {
    return _gulp2.default.src(client.js.src).pipe((0, _gulpCached2.default)('transpile')).pipe((0, _gulpBabel2.default)({
        presets: ['es2015'],
        plugins: ['external-helpers']
    })).pipe((0, _gulpPreprocess2.default)({
        context: {
            NODE_ENV: 'development'
        }
    })).on('error', function (e) {
        console.log(['-----------transpile error-----------\n', e.name, ': ', e.message, '\n', e.codeFrame, '\n', '-----------transpile error-----------'].join(''));
        this.emit('end');
    }).pipe((0, _gulpNgAnnotate2.default)({
        single_quotes: true
    })).pipe(_gulp2.default.dest(client.js.dist));
});

/**
 * watch transpile。
 */
_gulp2.default.task('watch', ['transpile'], function () {
    /*var watcher = */_gulp2.default.watch(client.js.src, ['transpile']);
    // gulp.watch(client.template.src, ['partial-html']);
    // watcher.on('change', function(event) {
    //     console.log('File ' + event.path + ' was ' + event.type + '.');
    // });
});

_gulp2.default.task('default', ['watch']);