const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const del = require('del');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const paths = {
    src: 'src',
    dist: 'dist'
};

gulp.task('clean', () => {
    return del.sync(paths.dist);
});

gulp.task('styles', ['clean'], () => {
    return gulp.src(`${paths.src}/sass/global.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('all.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${paths.dist}/styles`))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('scripts', ['clean'], () => {
    return gulp.src(`${paths.src}/js/**/*`)
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${paths.dist}/js`))
        .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('images', ['clean'], () => {
    return gulp.src(`${paths.src}/images/*`)
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('./dist/content'));
});

gulp.task('icons', ['clean'], () => {
    return gulp.src(`${paths.src}/icons/**/*`)
        .pipe(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest(`${paths.dist}/icons`));
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watch', () => {
    gulp.watch(`${paths.src}/sass/*`, ['styles']);
    gulp.watch(`${paths.src}/js/**/*`, ['scripts']);
});

gulp.task('build', ['styles', 'images', 'scripts', 'icons', 'serve']);

gulp.task('default', ['build', 'watch'], () => {
    util.log('Gulped all the things!');
});