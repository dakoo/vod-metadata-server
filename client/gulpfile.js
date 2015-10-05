var gulp = require('gulp');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
gulp.task('check', function() {
    return gulp.src(['*', 'controllers/*', 'view/*'])
        .pipe(livereload());
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('*', ['check']);
    gulp.watch('controllers/*', ['check']);
    gulp.watch('view/*', ['check']);
});
gulp.task('default', ['check','watch']);