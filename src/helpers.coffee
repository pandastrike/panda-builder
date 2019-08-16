import fs from "fs"
import {fromJSON} from "panda-parchment"

module = fromJSON fs.readFileSync "package.json"

resolve = (path) ->
  require.resolve path, paths: [ process.cwd() ]

replace = (changes, string) ->
  for change in changes
    string = string.replace change...
  string


export {module, resolve, replace}
