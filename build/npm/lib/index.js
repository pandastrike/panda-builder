"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
  var coffee, coffeescript, del;

  del = require("del");

  coffeescript = require("coffeescript");

  coffee = require("gulp-coffee");

  module.exports = function (gulp) {
    var compile, dest, module, parallel, print, run, series, src, target, targets, task;
    ({ task, series, parallel, src, dest } = gulp);
    // package.json object
    module = function () {
      var fs;
      fs = require("fs");
      return JSON.parse(fs.readFileSync("package.json"));
    }();
    // Helper to run external programs
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
    // Compile helper, taking target configuration
    // (target in configuration refers to output path)
    compile = function ({ source, target, settings }) {
      return function () {
        return src(source, {
          sourcemaps: true
        }).pipe(coffee(settings)).pipe(dest(target));
      };
    };
    targets = {
      active: [],
      preset: {
        npm: function () {
          task("npm:clean", function () {
            return del("build/npm");
          });
          (function () {
            var resolve, settings;
            resolve = function (path) {
              return require.resolve(path, {
                paths: [__dirname]
              });
            };
            settings = {
              coffee: coffeescript,
              transpile: {
                presets: [[resolve("babel-preset-env"), {
                  targets: {
                    node: "6.10"
                  }
                }], resolve("babel-preset-power-assert")]
              }
            };
            task("npm:compile:source", compile({
              source: "lib/**/*.coffee",
              target: "build/npm/lib",
              settings: settings
            }));
            return task("npm:compile:tests", compile({
              source: "test/**/*.coffee",
              target: "build/npm/test",
              settings: settings
            }));
          })();
          task("npm:build", series("npm:clean", parallel("npm:compile:source", "npm:compile:tests")));
          task("npm:run:tests", _asyncToGenerator(function* () {
            return print((yield run("node build/npm/test/index.js")));
          }));
          task("npm:test", series("npm:build", "npm:run:tests"));
          return task("npm:publish", series(_asyncToGenerator(function* () {
            return print((yield run("npm publish")));
          }), "git:tag"));
        },
        esm: function () {
          task("esm:build", function () {});
          task("esm:test", function () {});
          return task("esm:publish", function () {});
        },
        www: function () {
          task("www:build", function () {});
          task("www:test", function () {});
          return task("www:publish", function () {});
        }
      }
    };
    // Tag a release
    task("git:tag", _asyncToGenerator(function* () {
      var version;
      ({ version } = module);
      yield run(`git tag -am ${version} ${version}`);
      return yield run("git push --tags");
    }));
    task("clean", function () {
      return del("build");
    });
    (function () {
      var tasks;
      tasks = function (task) {
        var i, len, name, ref, results;
        ref = targets.active;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          name = ref[i];
          results.push(`${name}:${task}`);
        }
        return results;
      };
      // each of these is defined dyamically in case
      // active targets gets updated
      task("build", _asyncToGenerator(function* () {
        return yield parallel(tasks("build"))();
      }));
      task("test", _asyncToGenerator(function* () {
        return yield parallel(tasks("test"))();
      }));
      return task("publish", _asyncToGenerator(function* () {
        return yield parallel(tasks("publish"))();
      }));
    })();
    // if name references a preset, run the preset with
    // the definition as an arg. otw, the arg is a fn
    // defining the tasks under target name
    target = function (name, definition) {
      var f;
      targets.active.push(name);
      if ((f = targets.preset[name]) != null) {
        return f(definition);
      } else {
        return definition();
      }
    };
    return { target };
  };
}).call(undefined);