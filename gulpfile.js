const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      browserSync = require('browser-sync'),
      concat      = require('gulp-concat'), 
      uglify      = require('gulp-uglifyjs'),
      cssnano     = require('gulp-cssnano'),
      rename      = require('gulp-rename'),
      del         = require('del')
      imagemin    = require('gulp-imagemin'),
      pngquant    = require('imagemin-pngquant'),
      cache       = require('gulp-cache'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    return gulp.src('src/sass/style.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'src' 
        },
        notify: false 
    });
});

gulp.task('scripts', function() {
    return gulp.src([
            'src/libs/jquery/dist/jquery.min.js',
            'src/js/common.js'
        ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function(){
    return gulp.src('src/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

// gulp.task('css-libs', function() {
//     return gulp.src('src/css/style.sass')
//         .pipe(cssnano())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest('src/css'));
// });

gulp.task('watch', function(){
    gulp.watch('src/sass/style.sass', gulp.parallel('sass'));
    gulp.watch('src/*.html', gulp.parallel('code'))
    gulp.watch('src/js/common.js', gulp.parallel('scripts'));
});

gulp.task('default', gulp.parallel('sass', 'scripts', 'browser-sync', 'watch'));

// продакшин
gulp.task('clean', async function() {
    return del.sync('dist'); 
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*') 
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('prebuild', async function() {

    var buildCss = gulp.src('src/css/style.min.css',)
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('src/js/libs.min.js')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('src/*.html') 
    .pipe(gulp.dest('dist'));

});

gulp.task('build', gulp.series('sass', 'scripts', 'clean', 'prebuild', 'img'));