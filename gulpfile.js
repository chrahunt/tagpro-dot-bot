var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    assign = require('lodash.assign');

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
            .on('error', gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source(sourceFile.replace(/^src\//, '')))
            .pipe(gulp.dest('./build'));
    }
    b.on('update', bundle);
    b.on('log', gutil.log);
    return bundle();
});
