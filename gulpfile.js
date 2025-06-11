const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const through2 = require('through2');
const postcss = require('gulp-postcss');
const prettify = require('postcss-prettify');

// ✅ Named function to fix ESLint func-names
// eslint-disable-next-line prefer-arrow-callback
// eslint-disable-next-line prefer-arrow-callback
function transformToSameFolder(file, _, cb) {
  const scssFile = file.history[0];
  const dir = path.dirname(scssFile);
  const fileName = `${path.basename(scssFile, '.scss')}.css`; // ✅ ESLint-safe
  file.path = path.join(dir, fileName);
  cb(null, file);
}

function compileScss(filePath) {
  return gulp.src(filePath, { allowEmpty: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([prettify()])) // ✅ CSS formatting
    .pipe(through2.obj(transformToSameFolder)) // ✅ fix here
    .pipe(gulp.dest(file => path.dirname(file.path))); // Output to same folder
}

function watchScss() {
  gulp.watch('blocks/**/*.scss').on('change', (filePath) => {
    if (path.extname(filePath) === '.scss') {
      console.log(`Compiling: ${filePath}`);
      compileScss(filePath);
    }
  });
}

exports.default = watchScss;
