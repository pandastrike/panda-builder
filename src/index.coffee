import {start, go, map, wait, tee} from "panda-river"
import {glob, exists, isDirectory, isFile, ls, rm, rmDir} from "panda-quill"
import {module, resolve, json, replace} from "./helpers"
import {coffee, extension} from "./plugins"
import {print, sh} from "./sh"

# TODO: move to parchment or promise-helpers?
all = (px) -> Promise.all px

# TODO: move to river?
fan = (f) -> (producer) ->
  yield value for value from (await all (f value for value from producer))

# TODO: move to quill
rmr = (path) ->
  if await isDirectory path
    paths = await ls path
    (await rmr _path) for _path in paths
    rmDir path
  else if isFile path
    rm path

tools = (p9k) ->

  {define, run, create, write} = p9k
  task = define

  # TODO: add 'background tasks' to p9k
  parallel = (tasks...) -> -> Promise.all (run _t for _t in tasks)
  series = (tasks...) -> -> await run _t for _t in tasks

  cwd = process.cwd()

  # Compile helper, taking target configuration
  # (target in configuration refers to output path)
  compile = ({source, target, settings}) ->
    ->
      go [
        glob source, cwd
        map create cwd
        fan coffee settings
        map extension ".js"
        wait map write target
      ]

  targets =

    active: []

    preset:

      npm: ->

        task "npm:clean", -> rmr "build/npm"

        do (settings = undefined) ->

          # override defaults to support AWS Lambda
          settings =
            transpile:
              presets: [[
                resolve "@babel/preset-env"
                targets: node: "8.10"
              ]]

          task "npm:compile:source",
            compile
              source: "src/**/*.coffee"
              target: "build/npm"
              settings: settings

          task "npm:compile:tests",
            compile
              source: "test/**/*.coffee"
              target: "build/npm"
              settings: settings

        task "npm:build", ->
          await run "npm:clean"
          do parallel "npm:compile:source", "npm:compile:tests"

        task "npm:run:tests", ->
          print await sh "node build/npm/test/index.js"

        task "npm:test", series "npm:build", "npm:run:tests"

        task "npm:publish", -> print await sh "npm publish"

      web: ->

        task "web:clean", -> # rmr "build/web"

        do (settings = undefined) ->

          # get all the latest
          settings =
            transpile:
              presets: [[
                resolve "@babel/preset-env"
                targets: "last 2 chrome versions"
                modules: false
              ]]

          task "web:compile:source",
            compile
              source: "src/**/*.coffee"
              target: "build/web"
              settings: settings

          task "web:compile:tests",
            compile
              source: "test/**/*.coffee"
              target: "build/web"
              settings: settings

        task "web:build", ->
          await run "web:clean"
          do parallel "web:compile:source", "web:compile:tests"

        task "web:run:tests", ->
          # TODO: probably should run in headless browser
          print await sh "node build/web/test/index.js"

        task "web:test", series "web:build", "web:run:tests"

        task "web:publish", ->
          fs.writeFileSync "build/web/package.json",
            (replace [
              [ module.name, module.name + "-esm" ]
              [ "build/npm", "." ]
            ], (json module))
          print await sh "cd build/web && npm publish"


  # Tag a release
  task "git:tag", ->
    {version} = module
    await sh "git tag -am #{version} #{version}"
    await sh "git push --tags"

  task "clean", -> rmr "build"

  do ->

    tasks = (task) ->
      "#{name}:#{task}" for name in targets.active

    # each of these is defined dyamically in case
    # active targets gets updated
    task "build", ->
      await do parallel tasks "build"

    task "test", ->
      await do parallel tasks "test"

    task "publish", ->
      await do parallel tasks "publish"

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
