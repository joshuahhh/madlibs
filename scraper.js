console.log('welcome to joshindex.js');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');

module.exports = {
  scrapeFb: function (callback) {
    var binPath = phantomjs.path;
    var childArgs = [
      path.join(__dirname, 'phantomjs-script.js'),
    ];
    console.log('launching phantomjs');
    var child = childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
      console.log('phantomjs is donezo');
      callback(JSON.parse(fs.readFileSync('madlibs.json', 'utf8')));
    });
    child.stdout.on('data', function(data) {
      console.log(data.toString());
    });
  }
};
