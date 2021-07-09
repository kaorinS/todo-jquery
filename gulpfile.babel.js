const gulp = require('gulp'),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber'),
      sassGlob = require('gulp-sass-glob'),
      notify = require('gulp-notify'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCss = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      webpackConfig = require('./webpack.config'),
      webpack = require('webpack-stream'),
      uglify = require('gulp-uglify'),
      imagemin = require('gulp-imagemin'),
      mozjpeg = require('imagemin-mozjpeg'),
      pngquant = require('imagemin-pngquant'),
      changed = require('gulp-changed'),
      browserSync = require('browser-sync');

// Dart Sass使用
sass.compiler = require('sass');

// sassコンパイル
gulp.task('sass', function() {
    gulp.src("./src/scss/**/*.scss")
    // plumber
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    // glob有効
    .pipe(sassGlob())
    // コンパイル処理
    .pipe(sass())
    //ベンダープレフィックス付与
    .pipe(autoprefixer())
    // 書き出し
    .pipe(gulp.dest("./dist/css"));
});

// css圧縮
gulp.task('minify-css', function() {
    gulp.src("./dist/css/**/*.css")
    .pipe(cleanCss())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(gulp.dest("./public/css"));
});

// jsビルド
gulp.task('build', function() {
    gulp.src('./src/js/app.js')
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist/js'));
});

// js圧縮
gulp.task('minify-js', function(){
    gulp.src("./dist/js/**/*.js")
    .pipe(uglify())
    .pipe(rename({
        extname:".min.js"
    }))
    .pipe(gulp.dest("./public/js"));
});

// img圧縮
gulp.task('minify-img', function() {
    gulp.src("./img/**/*.{jpg, jpeg, png, gif, svg}")
    .pipe(changed('./dist/img'))
    .pipe(
        imagemin([
            pngquant({
                quality: [.60, .70], //画質
                speed: 1
            }),
            mozjpeg({ quality: 65 }),
            imagemin.svgo(),
            imagemin.optipng(),
            imagemin.gifsicle({ optimizationLevel: 3 })
        ])
    )
    .pipe(gulp.dest('./dist/img'));
});

// 自動リロード
gulp.task('browser-sync', function() {
    browserSync.init({
        // お決まり
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
});
gulp.task('bs-reload', function() {
    browserSync.reload();
});

// ファイル監視
gulp.task('watch', function() {
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("./dist/css/**/*.css", ['minify-css']);
    gulp.watch("./*.html", ['bs-reload']);
    gulp.watch("./public/**/*.+(js|css)", ['bs-reload']);
    gulp.watch("src/js/**/*.js", ['build']);
    gulp.watch("./dist/js/**/*.js", ['minify-js']);
});

// 実行
gulp.task('default', ['browser-sync','watch']);