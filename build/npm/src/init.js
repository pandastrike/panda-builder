"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
  var log, print, readFileSync, resolve, run, writeFileSync;

  ({ resolve } = require("path"));

  ({ readFileSync, writeFileSync } = require("fs"));

  require("colors");

  ({ run, print } = require("./run"));

  log = function (message) {
    return console.error(message);
  };

  _asyncToGenerator(function* () {
    var code, command, commands, messages, source, target;
    // resolve relative to the build directory
    source = resolve(__dirname, "..", "..", "..", "template");
    target = resolve(".");
    // add slash to tell rsync to sync contents
    commands = {
      sync: `rsync -ru ${source}/ ${target}`,
      deps: "npm i -D github:gulpjs/gulp#4.0 coffeescript amen"
    };
    messages = {
      start: "Panda Builder project initialization:".blue,
      sync: "Updating project files based on template...".green,
      deps: "Installing common dependences...".green,
      package: "Updating package.json...".green,
      finish: "Done.".blue
    };
    log(messages.start);
    for (code in commands) {
      command = commands[code];
      log(messages[code]);
      yield run(command);
    }
    log(messages.package);
    (function () {
      var pkg;
      pkg = JSON.parse(readFileSync("package.json", "utf8"));
      pkg.license = "MIT";
      pkg.scripts.test = "gulp npm:test";
      return writeFileSync("package.json", JSON.stringify(pkg, null, 2));
    })();
    return log(messages.finish);
  })();
}).call(undefined);