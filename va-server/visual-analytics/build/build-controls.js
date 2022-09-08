const gulp = require('gulp');
const gulpWebpack = require('webpack-stream');

module.exports = function () {

    // var result = 'brightics-va-controls.js';
    var dest = 'build/tmp';

    return gulp.src('src/entry.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'brightics-va-controls.js'
            }
        }))
        .pipe(gulp.dest(dest));
};
