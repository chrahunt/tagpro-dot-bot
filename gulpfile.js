var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    assign = require('lodash.assign'),
    notify = require('gulp-notify'),
    shell = require('gulp-shell');

var sourceFile = 'src/browserBot.js';
gulp.task('build', function() {
    return browserify({
            entries: sourceFile,
            debug: true
        })
        .bundle()
        .pipe(source(sourceFile.replace(/^src\//, '')))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
    var opts = assign({}, watchify.args, {
        entries: sourceFile,
        debug: true
    });
    var b = watchify(browserify(opts));
    function bundle() {
        return b.bundle()
            .on('error', notify.onError(function (err) {
                gutil.log("Browserify Error: " + err.message);
                return "Build Failed";
            }))
            .pipe(source(sourceFile.replace(/^src\//, '')))
            .pipe(gulp.dest('./build'))
            .pipe(notify("Build Succeeded"));
    }
    b.on('update', bundle);
    b.on('log', gutil.log);
    return bundle();
});

gulp.task('doc', shell.task([
    'node ./node_modules/jsdoc/jsdoc src -r -d docs -R README.md'
]));
