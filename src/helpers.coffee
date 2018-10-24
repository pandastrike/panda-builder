import fs from "fs"

module = JSON.parse fs.readFileSync "package.json"

resolve = (path) ->
  require.resolve path, paths: [ process.cwd() ]

json = (object) -> JSON.stringify object, null, 2

replace = (changes, string) ->
  for change in changes
    string = string.replace change...
  string


export {module, resolve, json, replace}
