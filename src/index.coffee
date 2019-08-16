import {go, map, wait} from "panda-river"
import {toJSON} from "panda-parchment"
import {write as _write, rmr} from "panda-quill"
import {module, resolve, replace} from "./helpers"
import {coffee} from "./plugins"
import {shell} from "./shell"

tools = (p9k) ->

  {define, run, glob, read, write, extension} = p9k

  cwd = process.cwd()

  # Compile helper, taking target configuration
  # (target in configuration refers to output path)
  compile = ({source, target, settings}) ->
    ->
      go [
        glob source, cwd
        wait map read
        map coffee settings
        map extension ".js"
        wait map write target
      ]

  targets =

    active: []

    preset:

      npm: ->

        define "npm:clean", -> rmr "build/npm"

        # override defaults to support AWS Lambda
        settings =
          transpile:
            presets: [[
              resolve "@babel/preset-env"
              targets: node: "12.8"
            ]]

        define "npm:compile:source",
          compile
            source: "src/**/*.coffee"
            target: "build/npm"
            settings: settings

        define "npm:compile:tests",
          compile
            source: "test/**/*.coffee"
            target: "build/npm"
            settings: settings

        define "npm:build", "npm:clean npm:compile:source& npm:compile:tests&"

        define "npm:run:tests", ->
          shell "node build/npm/test/index.js"

        define "npm:test", "npm:build npm:run:tests"

        define "npm:publish", -> shell "npm publish"

      web: ->

        define "web:clean", -> rmr "build/web"

        # get all the latest
        settings =
          transpile:
            presets: [[
              resolve "@babel/preset-env"
              targets: "last 2 chrome versions"
              modules: false
            ]]

        define "web:compile:source",
          compile
            source: "src/**/*.coffee"
            target: "build/web"
            settings: settings

        define "web:compile:tests",
          compile
            source: "test/**/*.coffee"
            target: "build/web"
            settings: settings

        define "web:build", "web:clean web:compile:source& web:compile:tests&"

        define "web:run:tests", ->
          # TODO: probably should run in headless browser
          shell "node build/web/test/index.js"

        define "web:test", "web:build web:run:tests"

        define "web:publish", ->
          _write "build/web/package.json",
            (replace [
              [ module.name, module.name + "-esm" ]
              [ "build/npm", "." ]
            ], (toJSON module, true))
          shell "cd build/web && npm publish"


  # Tag a release
  define "git:tag", ->
    {version} = module
    await shell "git tag -am #{version} #{version}"
    await shell "git push --tags"

  define "clean", -> rmr "build"

  # define dyamically because active targets isn't yet defined

  tasks = (task) ->
    -> run "#{name}:#{task}" for name in targets.active

  define "build", tasks "build"

  define "test", tasks "test"

  define "publish", tasks "publish"

  # if name references a preset, run the preset with
  # the definition as an arg. otw, the arg is a fn
  # defining the tasks under target name
  target = (name, definition) ->
    targets.active.push name
    if (f = targets.preset[name])?
      f definition
    else
      definition()

  {target}

export {tools}
