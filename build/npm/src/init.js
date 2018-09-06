"use strict";

var log, print, readFileSync, resolve, run, writeFileSync;

({ resolve } = require("path"));

({ readFileSync, writeFileSync } = require("fs"));

require("colors");

({ run, print } = require("./run"));

log = function (message) {
  return console.error(message);
};

(async function () {
  var code, command, commands, messages, source, target;
  // resolve relative to the build directory
  source = resolve(__dirname, "..", "..", "..", "template");
  target = resolve(".");
  // add slash to tell rsync to sync contents
  commands = {
    sync: `rsync -ru ${source}/ ${target} && mv ${target}/gitignore ${target}/.gitignore`,
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
    await run(command);
  }
  log(messages.package);
  (function () {
    var pkg;
    pkg = JSON.parse(readFileSync("package.json", "utf8"));
    pkg.main = "build/npm/src/index.js";
    pkg.license = "MIT";
    pkg.scripts.test = "gulp npm:test";
    return writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  })();
  return log(messages.finish);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLGFBQUE7O0FBQUEsQ0FBQSxFQUFBLE9BQUEsS0FBWSxRQUFaLE1BQVksQ0FBWjs7QUFDQSxDQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsS0FBZ0MsUUFBaEMsSUFBZ0MsQ0FBaEM7O0FBQ0EsUUFBQSxRQUFBOztBQUNBLENBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxLQUFlLFFBQWYsT0FBZSxDQUFmOztBQUVBLE1BQU0sVUFBQSxPQUFBLEVBQUE7U0FBYSxRQUFBLEtBQUEsQ0FBQSxPQUFBLEM7QUFBYixDQUFOOztBQUVHLENBQUEsa0JBQUE7QUFJRCxNQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQTs7QUFBQSxXQUFVLFFBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsQ0FBVjtBQUNBLFdBQVMsUUFEVCxHQUNTLENBQVQ7O0FBR0EsYUFBVztBQUNULFVBQU0sYUFBQSxNQUFBLEtBQUEsTUFBQSxVQUFBLE1BQUEsY0FBQSxNQURHLGFBQUE7QUFHVCxVQUFNO0FBSEcsR0FBWDtBQU1BLGFBQVc7QUFDVCxXQUFPLHdDQURFLElBQUE7QUFFVCxVQUFNLDhDQUZHLEtBQUE7QUFHVCxVQUFNLG1DQUhHLEtBQUE7QUFJVCxhQUFTLDJCQUpBLEtBQUE7QUFLVCxZQUFRLFFBQVE7QUFMUCxHQUFYO0FBUUEsTUFBSSxTQUFKLEtBQUE7QUFFQSxPQUFBLElBQUEsSUFBQSxRQUFBLEVBQUE7O0FBQ0UsUUFBSSxTQUFKLElBQUksQ0FBSjtBQUNBLFVBQU0sSUFBQSxPQUFBLENBQU47QUFGRjtBQUlBLE1BQUksU0FBSixPQUFBO0FBQ0csR0FBQSxZQUFBO0FBQ0QsUUFBQSxHQUFBO0FBQUEsVUFBTSxLQUFBLEtBQUEsQ0FBVyxhQUFBLGNBQUEsRUFBWCxNQUFXLENBQVgsQ0FBTjtBQUNBLFFBQUEsSUFBQSxHQUFXLHdCQUFYO0FBQ0EsUUFBQSxPQUFBLEdBQWMsS0FBZDtBQUNBLFFBQUksT0FBSixDQUFBLElBQUEsR0FBbUIsZUFBbkI7V0FDQSxjQUFBLGNBQUEsRUFBOEIsS0FBQSxTQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBOUIsQ0FBOEIsQ0FBOUIsQztBQUxGLEdBQUc7U0FVSCxJQUFJLFNBQUosTUFBQSxDO0FBdkNGLENBQUciLCJzb3VyY2VzQ29udGVudCI6WyJ7cmVzb2x2ZX0gPSByZXF1aXJlIFwicGF0aFwiXG57cmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jfSA9IHJlcXVpcmUgXCJmc1wiXG5yZXF1aXJlIFwiY29sb3JzXCJcbntydW4sIHByaW50fSA9IHJlcXVpcmUgXCIuL3J1blwiXG5cbmxvZyA9IChtZXNzYWdlKSAtPiBjb25zb2xlLmVycm9yIG1lc3NhZ2VcblxuZG8gLT5cblxuXG4gICMgcmVzb2x2ZSByZWxhdGl2ZSB0byB0aGUgYnVpbGQgZGlyZWN0b3J5XG4gIHNvdXJjZSA9IChyZXNvbHZlIF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwiLi5cIiwgXCJ0ZW1wbGF0ZVwiKVxuICB0YXJnZXQgPSByZXNvbHZlIFwiLlwiXG5cbiAgIyBhZGQgc2xhc2ggdG8gdGVsbCByc3luYyB0byBzeW5jIGNvbnRlbnRzXG4gIGNvbW1hbmRzID0ge1xuICAgIHN5bmM6IFwicnN5bmMgLXJ1ICN7c291cmNlfS8gI3t0YXJnZXR9ICYmXG4gICAgICBtdiAje3RhcmdldH0vZ2l0aWdub3JlICN7dGFyZ2V0fS8uZ2l0aWdub3JlXCJcbiAgICBkZXBzOiBcIm5wbSBpIC1EIGdpdGh1YjpndWxwanMvZ3VscCM0LjAgY29mZmVlc2NyaXB0IGFtZW5cIlxuICB9XG5cbiAgbWVzc2FnZXMgPSB7XG4gICAgc3RhcnQ6IFwiUGFuZGEgQnVpbGRlciBwcm9qZWN0IGluaXRpYWxpemF0aW9uOlwiLmJsdWVcbiAgICBzeW5jOiBcIlVwZGF0aW5nIHByb2plY3QgZmlsZXMgYmFzZWQgb24gdGVtcGxhdGUuLi5cIi5ncmVlblxuICAgIGRlcHM6IFwiSW5zdGFsbGluZyBjb21tb24gZGVwZW5kZW5jZXMuLi5cIi5ncmVlblxuICAgIHBhY2thZ2U6IFwiVXBkYXRpbmcgcGFja2FnZS5qc29uLi4uXCIuZ3JlZW5cbiAgICBmaW5pc2g6IFwiRG9uZS5cIi5ibHVlXG4gIH1cblxuICBsb2cgbWVzc2FnZXMuc3RhcnRcblxuICBmb3IgY29kZSwgY29tbWFuZCBvZiBjb21tYW5kc1xuICAgIGxvZyBtZXNzYWdlc1tjb2RlXVxuICAgIGF3YWl0IHJ1biBjb21tYW5kXG5cbiAgbG9nIG1lc3NhZ2VzLnBhY2thZ2VcbiAgZG8gLT5cbiAgICBwa2cgPSBKU09OLnBhcnNlIHJlYWRGaWxlU3luYyBcInBhY2thZ2UuanNvblwiLCBcInV0ZjhcIlxuICAgIHBrZy5tYWluID0gXCJidWlsZC9ucG0vc3JjL2luZGV4LmpzXCJcbiAgICBwa2cubGljZW5zZSA9IFwiTUlUXCJcbiAgICBwa2cuc2NyaXB0cy50ZXN0ID0gXCJndWxwIG5wbTp0ZXN0XCJcbiAgICB3cml0ZUZpbGVTeW5jIFwicGFja2FnZS5qc29uXCIsIEpTT04uc3RyaW5naWZ5IHBrZywgbnVsbCwgMlxuXG5cblxuXG4gIGxvZyBtZXNzYWdlcy5maW5pc2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=init.coffee