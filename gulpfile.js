const gulp = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const fs = require('fs');
const path = require('path');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// 1. Dist Klasörünü Hatasız Temizleme (Node.js fs ile)
function clean(done) {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
    }
    done();
}

// 2. HTML Dosyalarını Kopyalama
function copyHtml() {
    return gulp
        .src('*.html')
        .pipe(gulp.dest('dist'));
}

// 3. Görselleri Kopyalama
function copyImages() {
    return gulp
        .src('images/**/*')
        .pipe(gulp.dest('dist/images'));
}

// 4. JSON Verilerini Kopyalama
function copyJson() {
    return gulp
        .src('data/**/*.json')
        .pipe(gulp.dest('dist/data'));
}

// 5. SCSS Derleme ve Minify Etme
function compileAndMinifyCss() {
    return gulp
        .src('scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

// 6. JavaScript Dosyalarını Minify Etme
function minifyJs() {
    return gulp
        .src('js/**/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
}

// 7. Canlı Sunucu ve İzleme (Watch & BrowserSync)
function serve(done) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('scss/**/*.scss', compileAndMinifyCss);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('data/**/*.json').on('change', browserSync.reload);
}

// Paketleme (Build) Görevi
const build = gulp.series(
    clean,
    compileAndMinifyCss,
    gulp.parallel(
        copyHtml,
        copyImages,
        copyJson,
        minifyJs
    )
);

exports.clean = clean;
exports.build = build;
exports.serve = serve;
exports.default = gulp.series(build, serve);