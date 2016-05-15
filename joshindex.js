console.log('welcome to joshindex.js');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var fs = require('fs');

var binPath = phantomjs.path
console.log('binPath:', binPath);

var childArgs = [
  path.join(__dirname, 'phantomjs-script.js'),
  // 'some other argument (passed to phantomjs script)'
]

console.log('childArgs:', childArgs);

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  console.log('execution complete!');
  result = fs.readFileSync('madlibs.json', 'utf8');
  console.log(result);
  // console.log('stdout:', stdout);
  // console.log('stderr:', stderr);
})
