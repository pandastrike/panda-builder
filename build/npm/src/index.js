"use strict";

var coffee, del, extension, print, resolve, run;

del = require("del");

({ coffee, extension } = require("./plugins"));

({ resolve } = require("./helpers"));

({ print, run } = require("./run"));

module.exports = function (gulp) {
  var compile, dest, module, parallel, series, src, target, targets, task;
  ({ task, series, parallel, src, dest } = gulp);
  // package.json object
  module = function () {
    var fs;
    fs = require("fs");
    return JSON.parse(fs.readFileSync("package.json"));
  }();
  // Compile helper, taking target configuration
  // (target in configuration refers to output path)
  compile = function ({ source, target, settings }) {
    return function () {
      return src(source).pipe(coffee(settings)).pipe(extension(".js")).pipe(dest(target));
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
          var settings;
          // override defaults to support AWS Lambda
          settings = {
            transpile: {
              presets: [[resolve("babel-preset-env"), {
                targets: {
                  node: "8.10"
                }
              }]]
            }
          };
          task("npm:compile:source", compile({
            source: "src/**/*.coffee",
            target: "build/npm/src",
            settings: settings
          }));
          return task("npm:compile:tests", compile({
            source: "test/**/*.coffee",
            target: "build/npm/test",
            settings: settings
          }));
        })();
        task("npm:build", series("npm:clean", parallel("npm:compile:source", "npm:compile:tests")));
        task("npm:run:tests", async function () {
          return print((await run("node build/npm/test/index.js")));
        });
        task("npm:test", series("npm:build", "npm:run:tests"));
        return task("npm:publish", series(async function () {
          return print((await run("npm publish")));
        }));
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
  task("git:tag", async function () {
    var version;
    ({ version } = module);
    await run(`git tag -am ${version} ${version}`);
    return await run("git push --tags");
  });
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
    task("build", async function () {
      return await parallel(tasks("build"))();
    });
    task("test", async function () {
      return await parallel(tasks("test"))();
    });
    return task("publish", async function () {
      return await parallel(tasks("publish"))();
    });
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
//# sourceMappingURL=data:application/json;base64,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SCxJQUFBLEVBQUE7YUFDRSxFQURGLFVBQ0UsQztBQURGLEtBQUEsTUFBQTthQUFBLFk7O0FBRk8sR0FBVDtTQU9BLEVBQUEsTUFBQSxFO0FBaEhlLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiZGVsID0gcmVxdWlyZSBcImRlbFwiXG57Y29mZmVlLCBleHRlbnNpb259ID0gcmVxdWlyZSBcIi4vcGx1Z2luc1wiXG57cmVzb2x2ZX0gPSByZXF1aXJlIFwiLi9oZWxwZXJzXCJcbntwcmludCwgcnVufSA9IHJlcXVpcmUgXCIuL3J1blwiXG5cbm1vZHVsZS5leHBvcnRzID0gKGd1bHApIC0+XG5cbiAge3Rhc2ssIHNlcmllcywgcGFyYWxsZWwsIHNyYywgZGVzdH0gPSBndWxwXG5cbiAgIyBwYWNrYWdlLmpzb24gb2JqZWN0XG4gIG1vZHVsZSA9IGRvIC0+XG4gICAgZnMgPSByZXF1aXJlIFwiZnNcIlxuICAgIEpTT04ucGFyc2UgZnMucmVhZEZpbGVTeW5jIFwicGFja2FnZS5qc29uXCJcblxuICAjIENvbXBpbGUgaGVscGVyLCB0YWtpbmcgdGFyZ2V0IGNvbmZpZ3VyYXRpb25cbiAgIyAodGFyZ2V0IGluIGNvbmZpZ3VyYXRpb24gcmVmZXJzIHRvIG91dHB1dCBwYXRoKVxuICBjb21waWxlID0gKHtzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3N9KSAtPlxuICAgIC0+XG4gICAgICBzcmMgc291cmNlXG4gICAgICAucGlwZSBjb2ZmZWUgc2V0dGluZ3NcbiAgICAgIC5waXBlIGV4dGVuc2lvbiBcIi5qc1wiXG4gICAgICAucGlwZSBkZXN0IHRhcmdldFxuXG4gIHRhcmdldHMgPVxuXG4gICAgYWN0aXZlOiBbXVxuXG4gICAgcHJlc2V0OlxuXG4gICAgICBucG06IC0+XG5cbiAgICAgICAgdGFzayBcIm5wbTpjbGVhblwiLCAtPiBkZWwgXCJidWlsZC9ucG1cIlxuXG4gICAgICAgIGRvIC0+XG5cbiAgICAgICAgICAjIG92ZXJyaWRlIGRlZmF1bHRzIHRvIHN1cHBvcnQgQVdTIExhbWJkYVxuICAgICAgICAgIHNldHRpbmdzID1cbiAgICAgICAgICAgIHRyYW5zcGlsZTpcbiAgICAgICAgICAgICAgcHJlc2V0czogW1tcbiAgICAgICAgICAgICAgICByZXNvbHZlIFwiYmFiZWwtcHJlc2V0LWVudlwiXG4gICAgICAgICAgICAgICAgdGFyZ2V0czogbm9kZTogXCI4LjEwXCJcbiAgICAgICAgICAgICAgXV1cblxuICAgICAgICAgIHRhc2sgXCJucG06Y29tcGlsZTpzb3VyY2VcIixcbiAgICAgICAgICAgIGNvbXBpbGVcbiAgICAgICAgICAgICAgc291cmNlOiBcInNyYy8qKi8qLmNvZmZlZVwiXG4gICAgICAgICAgICAgIHRhcmdldDogXCJidWlsZC9ucG0vc3JjXCJcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG5cbiAgICAgICAgICB0YXNrIFwibnBtOmNvbXBpbGU6dGVzdHNcIixcbiAgICAgICAgICAgIGNvbXBpbGVcbiAgICAgICAgICAgICAgc291cmNlOiBcInRlc3QvKiovKi5jb2ZmZWVcIlxuICAgICAgICAgICAgICB0YXJnZXQ6IFwiYnVpbGQvbnBtL3Rlc3RcIlxuICAgICAgICAgICAgICBzZXR0aW5nczogc2V0dGluZ3NcblxuICAgICAgICB0YXNrIFwibnBtOmJ1aWxkXCIsXG4gICAgICAgICAgc2VyaWVzIFwibnBtOmNsZWFuXCIsXG4gICAgICAgICAgICBwYXJhbGxlbCBcIm5wbTpjb21waWxlOnNvdXJjZVwiLCBcIm5wbTpjb21waWxlOnRlc3RzXCJcblxuICAgICAgICB0YXNrIFwibnBtOnJ1bjp0ZXN0c1wiLCAtPlxuICAgICAgICAgIHByaW50IGF3YWl0IHJ1biBcIm5vZGUgYnVpbGQvbnBtL3Rlc3QvaW5kZXguanNcIlxuXG4gICAgICAgIHRhc2sgXCJucG06dGVzdFwiLCBzZXJpZXMgXCJucG06YnVpbGRcIiwgXCJucG06cnVuOnRlc3RzXCJcblxuICAgICAgICB0YXNrIFwibnBtOnB1Ymxpc2hcIixcbiAgICAgICAgICBzZXJpZXMgKC0+IHByaW50IGF3YWl0IHJ1biBcIm5wbSBwdWJsaXNoXCIpXG5cbiAgICAgIGVzbTogLT5cblxuICAgICAgICB0YXNrIFwiZXNtOmJ1aWxkXCIsIC0+XG5cbiAgICAgICAgdGFzayBcImVzbTp0ZXN0XCIsIC0+XG5cbiAgICAgICAgdGFzayBcImVzbTpwdWJsaXNoXCIsIC0+XG5cbiAgICAgIHd3dzogLT5cblxuICAgICAgICB0YXNrIFwid3d3OmJ1aWxkXCIsIC0+XG5cbiAgICAgICAgdGFzayBcInd3dzp0ZXN0XCIsIC0+XG5cbiAgICAgICAgdGFzayBcInd3dzpwdWJsaXNoXCIsIC0+XG5cbiAgIyBUYWcgYSByZWxlYXNlXG4gIHRhc2sgXCJnaXQ6dGFnXCIsIC0+XG4gICAge3ZlcnNpb259ID0gbW9kdWxlXG4gICAgYXdhaXQgcnVuIFwiZ2l0IHRhZyAtYW0gI3t2ZXJzaW9ufSAje3ZlcnNpb259XCJcbiAgICBhd2FpdCBydW4gXCJnaXQgcHVzaCAtLXRhZ3NcIlxuXG4gIHRhc2sgXCJjbGVhblwiLCAtPiBkZWwgXCJidWlsZFwiXG5cbiAgZG8gLT5cblxuICAgIHRhc2tzID0gKHRhc2spIC0+XG4gICAgICBcIiN7bmFtZX06I3t0YXNrfVwiIGZvciBuYW1lIGluIHRhcmdldHMuYWN0aXZlXG5cbiAgICAjIGVhY2ggb2YgdGhlc2UgaXMgZGVmaW5lZCBkeWFtaWNhbGx5IGluIGNhc2VcbiAgICAjIGFjdGl2ZSB0YXJnZXRzIGdldHMgdXBkYXRlZFxuICAgIHRhc2sgXCJidWlsZFwiLCAtPlxuICAgICAgYXdhaXQgZG8gcGFyYWxsZWwgdGFza3MgXCJidWlsZFwiXG5cbiAgICB0YXNrIFwidGVzdFwiLCAtPlxuICAgICAgYXdhaXQgZG8gcGFyYWxsZWwgdGFza3MgXCJ0ZXN0XCJcblxuICAgIHRhc2sgXCJwdWJsaXNoXCIsIC0+XG4gICAgICBhd2FpdCBkbyBwYXJhbGxlbCB0YXNrcyBcInB1Ymxpc2hcIlxuXG4gICMgaWYgbmFtZSByZWZlcmVuY2VzIGEgcHJlc2V0LCBydW4gdGhlIHByZXNldCB3aXRoXG4gICMgdGhlIGRlZmluaXRpb24gYXMgYW4gYXJnLiBvdHcsIHRoZSBhcmcgaXMgYSBmblxuICAjIGRlZmluaW5nIHRoZSB0YXNrcyB1bmRlciB0YXJnZXQgbmFtZVxuICB0YXJnZXQgPSAobmFtZSwgZGVmaW5pdGlvbikgLT5cbiAgICB0YXJnZXRzLmFjdGl2ZS5wdXNoIG5hbWVcbiAgICBpZiAoZiA9IHRhcmdldHMucHJlc2V0W25hbWVdKT9cbiAgICAgIGYgZGVmaW5pdGlvblxuICAgIGVsc2VcbiAgICAgIGRlZmluaXRpb24oKVxuXG4gIHt0YXJnZXR9XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=index.coffee