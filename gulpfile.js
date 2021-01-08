const { src, dest, series, parallel, watch } = require('gulp')
const browserify = require("browserify");
const tsify = require("tsify");
const source = require('vinyl-source-stream');
const inject = require('gulp-inject');
const gls = require('gulp-live-server');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const px2rem = require('postcss-px2rem');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const uglifycss = require('gulp-uglifycss');
const imagemin = require('gulp-imagemin');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const del = require('del');

// 解析参数选项gulp --name foldername => { name: foldername } 
const argv = require('minimist')(process.argv.slice(2));
const name = argv.name;
const command = argv.command;

// 删除构建目录
function clean() {
  return del([`dist/*`], { force: true });
}

// 构建less样式
function css() {
  // console.log('css');
  const processors = [px2rem({ remUnit: 75 })];
  return src(`./src/${name}/static/less/*.less`)
  .pipe(less())
  .pipe(postcss(processors))
  .pipe(uglifycss())
  .pipe(dest(`./dist/static/css`));
}

// 构建图片
function image() {
  return src(`./src/${name}/static/image/*`)
  .pipe(imagemin())
  .pipe(dest(`./dist/static/image`));
}

// 构建typescript
function js() {
  // console.log('js')
  return browserify({
    basedir: '.',
    debug: true,
    entries: [`src/${name}/static/ts/index.ts`]
  })
  .plugin(tsify, { target: 'es5' })
  .bundle()
  .pipe(source('index.min.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(dest(`./dist/static/js`));
}

// copy 插件
function copylib () {
  return src(`./src/${name}/static/lib/**/*.js`)
    .pipe(uglify())
    .pipe(dest(`./dist/static/lib`))
}

// copy html
function copyHtml() {
  // console.log('copyHtml')
  const sources = src([`./dist/static/js/*.js`, `./dist/static/css/*.css`], {read: false});
  return src([`src/${name}/*.html`]).pipe(inject(sources, {
    transform: (filepath) => {
      const url = filepath.replace(`/dist`, '.') + '?v=' + (new Date()).getTime();
      if (filepath.indexOf('css') > -1) {
        return `<link rel="stylesheet" href="${url}">`;
      } else {
        return `<script src="${url}"></script>`;
      }
    }
  })).pipe(dest(`dist`))
}

// web serve
function webserve() {
  const server = gls.static('dist')
  server.start();

  /**
   * 测试无法重新加载，只能手动刷新页面
   */
  // let watcher = watch([`dist/js/**/*.js`]);
  // watcher.on('all', (event, file) => {
  //   file = file.replace('dist', '.');
  //   console.log(file);
  //   server.notify.apply(server, [file]);
  // })
}

/**
 * 监控文件修改, 构建发布的时候不需要监控文件修改
 */
if (command !== 'build') {
  const watcherjs = watch(`src/${name}/static/ts/**/*.ts`);
  watcherjs.on('all', (event, file) => {
    console.log(event, file);
    js();
  });

  const watchercss = watch(`src/${name}/static/less/**/*.less`);
  watchercss.on('all', (event, file) => {
    console.log(event, file);
    css();
  });

  const watcherimage = watch(`src/${name}/static/image/**/*`);
  watcherimage.on('all', (event, file) => {
    console.log(event, file);
    image();
  });

  const watcherhtml = watch(`src/${name}/*.html`);
  watcherhtml.on('all', (event, file) => {
    console.log(event, file);
    copyHtml();
  });
}

const build = series(parallel(image, js, css, copylib), copyHtml);

// 条件判断默认task
if (fs.existsSync(`src/${name}`)) {
  if (command === 'build') {
    exports.default = series(clean, build);
  } else {
    exports.default = series(clean, build, webserve);
  }
} else {
  exports.default = (cb) => {
    console.log('\u001b[31m 找不到该目录！请执行 gulp --name luckyDraw 命令 \u001b[39m');
    cb();
  }
}
