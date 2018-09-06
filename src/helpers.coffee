thru = require "through2"


tee = (f) ->
  thru.obj (file, encoding, callback) ->
    await f file, encoding
    callback null, file

pluck = (key, f) ->
  tee (file) -> f file[key]

content = (f) ->
  tee (file, encoding) ->
    file.contents = Buffer.from await f (file.contents.toString encoding), file

resolve = (path) ->
  require.resolve path, paths: [ __dirname ]

merge = (args...) -> Object.assign {}, args...

module.exports = {tee, pluck, content, resolve, merge}
