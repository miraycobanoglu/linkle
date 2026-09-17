 const { src, dest, watch, series } = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const browserSync = require('browser-sync').create();

// 1. SCSS Dosyalarını Derleme Görevi
function scssTask() {
  return src('./scss/style.scss') // Ana scss giriş dosyamız
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./css')) // Çıktının yazılacağı yer (mevcut css klasörün)
    .pipe(browserSync.stream());
}

// 2. BrowserSync ile Canlı Sunucu ve İzleme (Watch) Görevi
function serve(done) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  
  // SCSS değişikliklerini izle
  watch('./scss/**/*.scss', scssTask);
  
  // HTML ve JS değişikliklerini izle, tarayıcıyı yenile
  watch('./*.html').on('change', browserSync.reload);
  watch('./js/**/*.js').on('change', browserSync.reload);
}

// Gulp Varsayılan Komutu
exports.default = series(scssTask, serve);