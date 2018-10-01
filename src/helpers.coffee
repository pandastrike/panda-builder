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
  require.resolve path, paths: [ process.cwd() ]

merge = (args...) -> Object.assign {}, args...

json = (object) -> JSON.stringify object, null, 2

replace = (changes, string) ->
  for change in changes
    string = string.replace change...
  string

module.exports = {tee, pluck, content, resolve, merge, json, replace}
