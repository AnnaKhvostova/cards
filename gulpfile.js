const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imagemin = require('gulp-imagemin');
let babel = require('gulp-babel');
const browserSync = require('browser-sync').create();


function styles() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./dist/scss'))
        .pipe(concat('styles.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}


function scripts() {
    return gulp.src('./src/js/**/*.js')
        //.pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src('./src/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/img'))
}

function clean() {
    return del(['dist/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        port: 5500,
        open: true,
        browser: "firefox",
    });

    gulp.watch('./src/scss/**/*.scss', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./src/img/*', images)
    gulp.watch("./*.html").on('change', browserSync.reload);
}


gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('imagemin', images);
gulp.task('del', clean);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, images)));
gulp.task('dev', gulp.series('build', 'watch'));