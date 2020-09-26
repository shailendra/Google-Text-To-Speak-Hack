var gulp = require("gulp");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
var sourcemaps = require("gulp-sourcemaps");


//--- below Common JS for site Concat in one js folder
var commonJSArray = [];
commonJSArray.push("js-source/hack.js");


//---- one time Compress JS cmd -:   gulp processJS
function processCommonJS(){
   return gulp.src(commonJSArray,{allowEmpty:true})
       .pipe(concat("main.js"))
       .pipe(sourcemaps.init())
       .pipe(minify({
           ext: {
               src: "-debug.js",
               min: "-min.js",
           },
       }))
       //.pipe(sourcemaps.write("./maps"))
       .pipe(gulp.dest("js"));
}
function processJS(cb) {
   processCommonJS();
   cb();  
}
gulp.task("processJS", processJS);

//---- continuew Compress JS cmd -:   gulp watchJS
gulp.task("watchJS", function (cb) {
   processJS(cb);
   gulp.watch([...commonJSArray], processJS);
});
