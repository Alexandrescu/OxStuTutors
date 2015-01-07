// gulpfile.js
var gulp = require('gulp');

// Running the express
var server = require('gulp-express');

// Compiling sass
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// This is the vendor store.
// Everything that needs copied in the public folder
var vendor;
vendor = [
    {
        file: './bower_components/angular/angular.js',
        destination: '/angular/'
    },
    {
        file: './bower_components/bootstrap/dist/css/*',
        destination: '/bootstrap/css/'
    },
    {
        file: './bower_components/bootstrap/dist/js/*.js',
        destination: '/bootstrap/js/'
    }
];

var vendorLocation = './public/vendor';

gulp.task('vendor', function() {

    vendor.forEach(function(entry) {
       gulp.src(entry.file).
           pipe(gulp.dest(vendorLocation + entry.destination));
    });

});

// Compiling sass
gulp.task('styles:scss', function() {
    gulp.src('./styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/stylesheets'));
})

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run({
        // file: 'app.js'
        file: './bin/www'
    });

    // Restart the server when file changes
    gulp.watch(['views/**/*.jade'], server.notify);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
    //Event object won't pass down to gulp.watch's callback if there's more than one of them.
    //So the correct way to use server.notify is as following:

    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

gulp.task('default', ['vendor', 'server']);