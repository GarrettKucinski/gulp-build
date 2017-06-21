const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const paths = {
    src: 'src',
    dist: 'dist'
};

gulp.task('styles', () => {
    gulp.src(`${paths.src}/sass/global.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('all.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${paths.dist}/styles`))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('scripts', () => {
    gulp.src(`${paths.src}/js/**/*`)
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${paths.dist}/js`))
        .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('images', () => {
    gulp.src(`${paths.src}/images/*`)
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('./dist/content'));

    gulp.src(`${paths.src}/icons/**/*`)
        .pipe(gulp.dest(`${paths.dist}/icons`));
});

gulp.task('clean', () => {
    return gulp.src(`${paths.dist}`, { read: false })
        .pipe(clean());
});

gulp.task('build', ['clean', 'styles', 'scripts', 'images']);

gulp.task('watch', () => {
    gulp.watch(`${paths.src}/sass/*`, ['styles']);
    gulp.watch(`${paths.src}/js/**/*`, ['scripts']);
});

gulp.task('default', ['build', 'watch'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    util.log('Gulped all the things!');
});