const fs = require('fs');
var path = require('path');
var sass = require('node-sass');


function mergeFile(file) {
    var baseName = path.basename(file, path.extname(file));
    var tmplPath = file.replace(path.basename(file), baseName + '.html' );
    var stylePath = file.replace(path.basename(file), baseName + '.scss' );
    var rtnString = '(function() {';

    if (fs.existsSync(tmplPath)) {
        rtnString += `var page='`;
        var tmpl = fs.readFileSync(tmplPath, "utf8");
        rtnString += tmpl.replace(/(?:\r\n|\r|\n)/g, '');
        rtnString += `';`;
    }
    
    if (fs.existsSync(stylePath)) {
        var stl = fs.readFileSync(stylePath, "utf8");
        var stlCmpld = sass.renderSync({data: stl, linefeed: ''});
        rtnString += `var style='`;
        rtnString += (String(stlCmpld.css).replace(/(?:\r\n|\r|\n)/g, ' ').replace("'", "\\'"));
        rtnString += `';`;
    }

    rtnString += fs.readFileSync(file, "utf8");
    rtnString += '})();';
    return rtnString;
}

exports && (exports.mergeFile = mergeFile);
