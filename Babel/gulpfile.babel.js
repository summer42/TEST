import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import sourcemaps from 'gulp-sourcemaps';
import useref from 'gulp-useref';
import gulpif from 'gulp-if';
import cssmin from 'gulp-minify-css';


gulp.task('watch', ['transpile'], () => {
    gulp.watch('source/**/*.js', ['transpile']);
});

gulp.task('release-js',
    () => gulp.src('/source/*.js')
        // .pipe(stripDebug())       
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('/js/'))
);

/**
 * 验证并转换前端 js。
 */
gulp.task('transpile', ['hint-js'],
    () => gulp.src('/source/*.js')
        .pipe(cached('transpile'))
        .pipe(babel())
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
        .pipe(gulp.dest("/js/"))
);


gulp.task('css', function () {
    gulp.src('css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('css2'));
});

gulp.task('dangjian', () => {
    return gulp.src('bundles.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        // .pipe(concat('common-package-js.js'))
        // .pipe(uglify())
        // .pipe(rev())
        .pipe(gulp.dest('js/'))
    // .pipe(rev.manifest('rev-js.json'))
    // .pipe(gulp.dest('dist/public/rev/js/'));
});

gulp.task('onecss', () => {
    return gulp.src('styles.html')
        .pipe(useref())
        // .pipe(concat('common-package-js.js'))
        // .pipe(uglify())
        // .pipe(rev())
        .pipe(gulp.dest('css2/'))
    // .pipe(rev.manifest('rev-js.json'))
    // .pipe(gulp.dest('dist/public/rev/js/'));
});
