"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
  module.exports = function (gulp) {
    var _, build, coffee, coffeescript, compile, del, description, dest, module, name, parallel, pug, run, series, src, stylus, target, targets, task, test, webserver;
    del = require("del");
    pug = require("gulp-pug");
    stylus = require("gulp-stylus");
    coffeescript = require("coffeescript");
    coffee = require("gulp-coffee");
    webserver = require("gulp-webserver");
    ({ task, series, parallel, src, dest } = gulp);
    console.log("defining fairmont build tasks");
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
    targets = {
      npm: function (path, env, generate) {
        path = require("path");
        env = path.join(__dirname, "..", "node_modules", "babel-preset-env");
        generate = function (source, target) {
          return {
            source: `${source}/**/*.coffee`,
            target: target,
            settings: {
              coffee: coffeescript,
              transpile: {
                presets: [[env, {
                  targets: {
                    node: "6.10"
                  }
                }]]
              }
            }
          };
        };
        return {
          name: "npm",
          source: generate("src", "lib"),
          tests: generate("test", "lib/test"),
          publish: "npm publish"
        };
      }(null, null, null)
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
    // Test helper, taking target configuration
    // (target in configuration refers to output path)
    test = function ({ target }) {
      return _asyncToGenerator(function* () {
        var stderr, stdout;
        [stdout, stderr] = yield run(`node ${target}/index.js`);
        if (stdout.length > 0) {
          process.stdout.write(stdout);
        }
        if (stderr.length > 0) {
          return process.stderr.write(stderr);
        }
      });
    };
    // Generate target tasks for compiling, testing, publishing
    target = function (description) {
      var name;
      ({ name } = description);
      task(`${name}:compile:source`, compile(description.source));
      task(`${name}:compile:tests`, compile(description.tests));
      task(`${name}:compile`, parallel(`${name}:compile:source`, `${name}:compile:tests`));
      task(`${name}:tests:run`, test(description.tests));
      task(`${name}:test`, series(`${name}:compile`, `${name}:tests:run`));
      return task(`${name}:publish`, series(`${name}:compile:source`, _asyncToGenerator(function* () {
        return yield run(description.publish);
      })));
    };
    for (name in targets) {
      description = targets[name];
      target(description);
    }
    task("test", parallel(...function () {
      var results;
      results = [];
      for (name in targets) {
        _ = targets[name];
        results.push(`${name}:test`);
      }
      return results;
    }()));
    task("compile", parallel(...function () {
      var results;
      results = [];
      for (name in targets) {
        _ = targets[name];
        results.push(`${name}:compile`);
      }
      return results;
    }()));
    task("publish", parallel(...function () {
      var results;
      results = [];
      for (name in targets) {
        _ = targets[name];
        results.push(`${name}:publish`);
      }
      return results;
    }()));
    // Tag a release
    task("git:tag", _asyncToGenerator(function* () {
      var version;
      ({ version } = module);
      yield run(`git tag -am ${version} ${version}`);
      return yield run("git push --tags");
    }));
    // Web site related tasks…
    task("www:server", function () {
      return gulp.src("build").pipe(webserver({
        livereload: true,
        port: 8000,
        extensions: ["html"]
      }));
    });
    task("www:clean", function () {
      return del("build");
    });
    task("www:html", function () {
      return gulp.src(["www/**/*.pug"]).pipe(pug({})).pipe(dest("build"));
    });
    task("www:css", function () {
      return gulp.src("www/**/*.styl").pipe(stylus()).pipe(dest("build"));
    });
    task("www:js", function () {
      return gulp.src("www/**/*.coffee", {
        sourcemaps: true
      }).pipe(coffee({
        coffee: coffeescript,
        transpile: {
          presets: [["env", {
            targets: { browsers },
            modules: false
          }]]
        }
      })).pipe(dest("www"));
    });
    task("www:images", function () {
      return gulp.src(["www/images/**/*"]).pipe(dest("build/images"));
    });
    // watch doesn't take a task name for some reason
    // so we need to first define this as a function
    build = series("www:clean", parallel("www:html", "www:css", "www:js", "www:images"));
    task("www:build", build);
    task("www:watch", function () {
      return watch(["www/**/*"], build);
    });
    return task("www", series("www:build", parallel("www:watch", "www:server")));
  };
}).call(undefined);