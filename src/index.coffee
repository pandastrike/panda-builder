fs = require "fs"
del = require "del"
{coffee, extension} = require "./plugins"
{resolve, json, replace} = require "./helpers"
{print, run} = require "./run"

module.exports = (gulp) ->

  {task, series, parallel, src, dest} = gulp

  # package.json object
  module = do ->
    JSON.parse fs.readFileSync "package.json"

  # Compile helper, taking target configuration
  # (target in configuration refers to output path)
  compile = ({source, target, settings}) ->
    ->
      src source
      .pipe coffee settings
      .pipe extension ".js"
      .pipe dest target

  targets =

    active: []

    preset:

      npm: ->

        task "npm:clean", -> del "build/npm"

        do ->

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
              target: "build/npm/src"
              settings: settings

          task "npm:compile:tests",
            compile
              source: "test/**/*.coffee"
              target: "build/npm/test"
              settings: settings

        task "npm:build",
          series "npm:clean",
            parallel "npm:compile:source", "npm:compile:tests"

        task "npm:run:tests", ->
          print await run "node build/npm/test/index.js"

        task "npm:test", series "npm:build", "npm:run:tests"

        task "npm:publish", -> print await run "npm publish"

      web: ->

        task "web:clean", -> del "build/web"

        do ->
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
              target: "build/web/src"
              settings: settings

          task "web:compile:tests",
            compile
              source: "test/**/*.coffee"
              target: "build/web/test"
              settings: settings

        task "web:build",
          series "web:clean",
            parallel "web:compile:source", "web:compile:tests"

        task "web:run:tests", ->
          # TODO: probably should run in headless browser
          print await run "node build/web/test/index.js"

        task "web:test", series "web:build", "web:run:tests"

        task "web:publish", ->
          fs.writeFileSync "build/web/package.json",
            (replace [
              [ module.name, module.name + "-esm" ]
              [ "build/npm", "." ]
            ], (json module))
          print await run "cd build/web && npm publish"


  # Tag a release
  task "git:tag", ->
    {version} = module
    await run "git tag -am #{version} #{version}"
    await run "git push --tags"

  task "clean", -> del "build"

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
