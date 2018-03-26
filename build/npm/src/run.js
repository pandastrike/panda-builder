'use strict';

(function () {
  // Helpers to run external programs
  var print, run;

  run = function () {
    var exec;
    ({ exec } = require('child_process'));
    return function (command) {
      return new Promise(function (yay, nay) {
        return exec(command, function (error, stdout, stderr) {
          if (error == null) {
            return yay([stdout, stderr]);
          } else {
            return nay(error);
          }
        });
      });
    };
  }();

  // print output
  print = function ([stdout, stderr]) {
    if (stdout.length > 0) {
      process.stdout.write(stdout);
    }
    if (stderr.length > 0) {
      return process.stderr.write(stderr);
    }
  };

  module.exports = { run, print };
}).call(undefined);