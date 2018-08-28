const fs = require('fs');
const mergeFile = require('./merge-file').mergeFile;
const UglifyJS = require("uglify-js");

var file = __dirname + '/src/lib/page-feedback.js';

const elementJS =mergeFile(file);
var result = UglifyJS.minify(elementJS);

if (!fs.existsSync('./dist/')) {
    fs.mkdirSync('./dist/');
}

fs.writeFileSync('./dist/page-feedback-element.js', elementJS);
fs.writeFileSync('./dist/page-feedback-element.min.js', result.code);

