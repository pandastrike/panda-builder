"use strict";

var coffee, coffeescript, content, extension, merge, resolve, tee;

coffeescript = require("coffeescript");

({ tee, content, resolve, merge } = require("./helpers"));

extension = function (extension) {
  return tee(function (file) {
    return file.extname = extension;
  });
};

coffee = function (settings) {
  return content(function (code, file) {
    return function (defaults) {
      defaults = {
        bare: true,
        inlineMap: true,
        filename: file.relative,
        transpile: function () {
          if (settings.transpile == null) {
            return {
              presets: [[resolve("babel-preset-stage-3")]]
            };
          }
        }()
      };
      return coffeescript.compile(code, merge(defaults, settings));
    }(void 0);
  });
};

module.exports = { extension, coffee };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBQSxNQUFBLEVBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBOztBQUFBLGVBQWUsUUFBQSxjQUFBLENBQWY7O0FBRUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsS0FBaUMsUUFBakMsV0FBaUMsQ0FBakM7O0FBRUEsWUFBWSxVQUFBLFNBQUEsRUFBQTtTQUFlLElBQUksVUFBQSxJQUFBLEVBQUE7V0FBVSxLQUFBLE9BQUEsR0FBZSxTO0FBQTdCLEdBQUEsQztBQUFmLENBQVo7O0FBR0EsU0FBUyxVQUFBLFFBQUEsRUFBQTtTQUVMLFFBQVEsVUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBO1dBRUQsVUFBQSxRQUFBLEVBQUE7QUFFRCxpQkFDRTtBQUFBLGNBQUEsSUFBQTtBQUNBLG1CQURBLElBQUE7QUFFQSxrQkFBVSxLQUZWLFFBQUE7QUFHQSxtQkFBYyxZQUFBO0FBQ1osY0FBSSxTQUFBLFNBQUEsSUFBSixJQUFBLEVBQUE7bUJBQ0U7QUFBQSx1QkFBUyxDQUFDLENBQUUsUUFBSCxzQkFBRyxDQUFGLENBQUQ7QUFBVCxhOztBQUZPLFNBQUc7QUFIZCxPQURGO2FBUUEsYUFBQSxPQUFBLENBQUEsSUFBQSxFQUEyQixNQUFBLFFBQUEsRUFBM0IsUUFBMkIsQ0FBM0IsQztBQVZGLEtBQUcsQ0FBWSxLQUFmLENBQUcsQztBQUZQLEdBQUEsQztBQUZLLENBQVQ7O0FBZ0JBLE9BQUEsT0FBQSxHQUFpQixFQUFBLFNBQUEsRUFBQSxNQUFBLEVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29mZmVlc2NyaXB0ID0gcmVxdWlyZSBcImNvZmZlZXNjcmlwdFwiXG5cbnt0ZWUsIGNvbnRlbnQsIHJlc29sdmUsIG1lcmdlfSA9IHJlcXVpcmUgXCIuL2hlbHBlcnNcIlxuXG5leHRlbnNpb24gPSAoZXh0ZW5zaW9uKSAtPiB0ZWUgKGZpbGUpIC0+IGZpbGUuZXh0bmFtZSA9IGV4dGVuc2lvblxuXG5cbmNvZmZlZSA9IChzZXR0aW5ncykgLT5cblxuICAgIGNvbnRlbnQgKGNvZGUsIGZpbGUpIC0+XG5cbiAgICAgICAgZG8gKGRlZmF1bHRzID0gdW5kZWZpbmVkKSAtPlxuXG4gICAgICAgICAgZGVmYXVsdHMgPVxuICAgICAgICAgICAgYmFyZTogdHJ1ZVxuICAgICAgICAgICAgaW5saW5lTWFwOiB0cnVlXG4gICAgICAgICAgICBmaWxlbmFtZTogZmlsZS5yZWxhdGl2ZVxuICAgICAgICAgICAgdHJhbnNwaWxlOiBkbyAtPlxuICAgICAgICAgICAgICBpZiAhc2V0dGluZ3MudHJhbnNwaWxlP1xuICAgICAgICAgICAgICAgIHByZXNldHM6IFtbIHJlc29sdmUgXCJiYWJlbC1wcmVzZXQtc3RhZ2UtM1wiIF1dXG5cbiAgICAgICAgICBjb2ZmZWVzY3JpcHQuY29tcGlsZSBjb2RlLCBtZXJnZSBkZWZhdWx0cywgc2V0dGluZ3NcblxubW9kdWxlLmV4cG9ydHMgPSB7ZXh0ZW5zaW9uLCBjb2ZmZWV9XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=plugins.coffee