'use strict';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBQSxLQUFBLEVBQUEsR0FBQTs7QUFDQSxNQUFTLFlBQUE7QUFDUCxNQUFBLElBQUE7QUFBQSxHQUFBLEVBQUEsSUFBQSxLQUFTLFFBQVQsZUFBUyxDQUFUO1NBQ0EsVUFBQSxPQUFBLEVBQUE7V0FDRSxJQUFBLE9BQUEsQ0FBWSxVQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUE7YUFDVixLQUFBLE9BQUEsRUFBYyxVQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ1osWUFBSSxTQUFKLElBQUEsRUFBQTtpQkFDRSxJQUFJLENBQUEsTUFBQSxFQUROLE1BQ00sQ0FBSixDO0FBREYsU0FBQSxNQUFBO2lCQUdFLElBSEYsS0FHRSxDOztBQUpKLE9BQUEsQztBQURGLEtBQUEsQztBQURGLEc7QUFIRixDQUNTLEVBQVQ7OztBQVdBLFFBQVEsVUFBQyxDQUFBLE1BQUEsRUFBRCxNQUFDLENBQUQsRUFBQTtBQUNOLE1BQStCLE9BQUEsTUFBQSxHQUEvQixDQUFBLEVBQUE7QUFBQSxZQUFRLE1BQVIsQ0FBQSxLQUFBLENBQUEsTUFBQTs7QUFDQSxNQUErQixPQUFBLE1BQUEsR0FBL0IsQ0FBQSxFQUFBO1dBQUEsUUFBUSxNQUFSLENBQUEsS0FBQSxDQUFBLE1BQUEsQzs7QUFGTSxDQUFSOztBQUlBLE9BQUEsT0FBQSxHQUFpQixFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBIZWxwZXJzIHRvIHJ1biBleHRlcm5hbCBwcm9ncmFtc1xucnVuID0gZG8gLT5cbiAge2V4ZWN9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpXG4gIChjb21tYW5kKSAtPlxuICAgIG5ldyBQcm9taXNlICh5YXksIG5heSkgLT5cbiAgICAgIGV4ZWMgY29tbWFuZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgICAgaWYgIWVycm9yP1xuICAgICAgICAgIHlheSBbc3Rkb3V0LCBzdGRlcnJdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuYXkgZXJyb3JcblxuIyBwcmludCBvdXRwdXRcbnByaW50ID0gKFtzdGRvdXQsIHN0ZGVycl0pIC0+XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlIHN0ZG91dCBpZiBzdGRvdXQubGVuZ3RoID4gMFxuICBwcm9jZXNzLnN0ZGVyci53cml0ZSBzdGRlcnIgaWYgc3RkZXJyLmxlbmd0aCA+IDBcblxubW9kdWxlLmV4cG9ydHMgPSB7cnVuLCBwcmludH1cbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=run.coffee