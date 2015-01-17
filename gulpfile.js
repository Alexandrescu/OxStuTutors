// gulpfile.js
var gulp = require('gulp');

// Running the express
var server = require('gulp-express');
var serverOptions = {
    file: './bin/www'
};

// Compressing images
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// Compiling sass
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Concatenating files
var concat = require('gulp-concat');

// This is the vendor store.
// Everything that needs copied in the public folder
var vendor;
vendor = [
    {
        file: './bower_components/angular/angular.js',
        destination: './public/vendor/angular/'
    },
    {
        file: './bower_components/bootstrap/dist/css/*',
        destination: './public/vendor/bootstrap/css/'
    },
    {
        file: './bower_components/bootstrap/dist/js/*.js',
        destination: './public/vendor/bootstrap/js/'
    },
    {
        file: './bower_components/bootstrap-sass-official/assets/stylesheets/**/*.scss',
        destination: './sass/'
    }
];

gulp.task('vendor', function() {

    vendor.forEach(function(entry) {
       gulp.src(entry.file).
           pipe(gulp.dest(entry.destination));
    });
});

// TODO: Implement task dependency on gulp styles:scss
// At the moment styles:scss will crash if I call it without vendor first.
// Tried using the callback method in vendor but I reckon there's more to be done
// when I am running several streams.

// Compiling sass
gulp.task('styles:scss', function() {
    gulp.src('./styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/stylesheets'));
});

// Moving javascript
// TODO: Add minify uglify jshint etc.
gulp.task('js', function() {
    gulp.src('./app/controllers/*')
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('./public/javascripts/'));

    gulp.src('./app/services/*')
        .pipe(gulp.dest('./public/javascripts/services'));

    gulp.src('./app/app.js')
        .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('angular', function() {
    console.log('Doing angular');

    gulp.src([
        './bower_components/angular/angular.js',
        './bower_components/angular-bootstrap/ui-bootstrap.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-resource/angular-resource.js',
        './bower_components/angular-cookies/angular-cookies.js',
        './bower_components/angular-http-auth/src/http-auth-interceptor.js'])
        .pipe(concat('allangular.js'))
        .pipe(gulp.dest('./public/javascripts/'));
});

// This is a bug fix
gulp.task('express-run', function(cb) {
    // Start the server at the beginning of the task
    server.run(serverOptions);
    cb();
});

// Running the express server
gulp.task('server', ['express-run'], function () {
    gulp.watch(['./styles/**/*.scss'], ['styles:scss']);
    gulp.watch(['./app/**/*.js'], ['js']);

    // Restart the server when file changes
    gulp.watch(['views/**/*.jade'], server.notify);
    gulp.watch(['./public/stylesheets/**/*.css'], server.notify);
    gulp.watch(['./public/**/*.js'], server.notify);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
    //Event object won't pass down to gulp.watch's callback if there's more than one of them.
    //So the correct way to use server.notify is as following:

    //gulp.watch(['app/scripts/**/*.js'], ['jshint']);

    gulp.watch(['./routes/**/*.js'], server.notify);
    gulp.watch(['server.js', 'passport.js', './lib/**/*.js', 'views/**/*.js'], ['express-run']);
});


// Task for compressing images
gulp.task('imageCompression', function() {
    return gulp.src('./media/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/media/'));
});

gulp.task('build', ['imageCompression', 'vendor', 'angular']);

gulp.task('default', ['styles:scss', 'server']);