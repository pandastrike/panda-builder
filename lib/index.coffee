del = require "del"
coffeescript = require "coffeescript"
coffee = require "gulp-coffee"

module.exports = (gulp) ->

  {task, series, parallel, src, dest} = gulp

  # package.json object
  module = do ->
    fs = require "fs"
    JSON.parse fs.readFileSync "package.json"

  # Helper to run external programs
  run = do ->
    {exec} = require('child_process')
    (command) ->
      new Promise (yay, nay) ->
        exec command, (error, stdout, stderr) ->
          if !error?
            yay [stdout, stderr]
          else
            nay error

  # print output
  print = ([stdout, stderr]) ->
    process.stdout.write stdout if stdout.length > 0
    process.stderr.write stderr if stderr.length > 0

  # Compile helper, taking target configuration
  # (target in configuration refers to output path)
  compile = ({source, target, settings}) ->
    ->
      src source, sourcemaps: true
      .pipe coffee settings
      .pipe dest target

  targets =

    active: []

    preset:

      npm: ->

        task "npm:clean", -> del "build/npm"

        do ->

          resolve = (path) ->
            require.resolve path, paths: [ __dirname ]

          settings =
            coffee: coffeescript
            transpile:
              presets: [
                [
                  resolve "babel-preset-env"
                  targets: node: "6.10"
                ]
                resolve "babel-preset-power-assert"
              ]

          task "npm:compile:source",
            compile
              source: "lib/**/*.coffee"
              target: "build/npm/lib"
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

        task "npm:publish",
          series (-> print await run "npm publish"),
            "git:tag"

      esm: ->

        task "esm:build", ->

        task "esm:test", ->

        task "esm:publish", ->

      www: ->

        task "www:build", ->

        task "www:test", ->

        task "www:publish", ->

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
