module.exports = (gulp) ->
  del = require "del"
  pug = require "gulp-pug"
  stylus = require "gulp-stylus"
  coffeescript = require "coffeescript"
  coffee = require "gulp-coffee"
  webserver = require "gulp-webserver"
  {task, series, parallel, src, dest} = gulp

  console.log "defining fairmont build tasks"

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

  targets =
    npm: do (path=null, env=null, generate=null) ->
      path = require "path"
      env = path.join __dirname, "..", "node_modules", "babel-preset-env"
      generate = (source, target) ->
        source: "#{source}/**/*.coffee"
        target: target
        settings:
          coffee: coffeescript
          transpile:
            presets: [[ env, targets: node: "6.10" ]]

      name: "npm"
      source: generate "src", "lib"
      tests: generate "test", "lib/test"
      publish: "npm publish"

  # Compile helper, taking target configuration
  # (target in configuration refers to output path)
  compile = ({source, target, settings}) ->
    ->
      src source, sourcemaps: true
      .pipe coffee settings
      .pipe dest target

  # Test helper, taking target configuration
  # (target in configuration refers to output path)
  test = ({target}) ->
    ->
      [stdout, stderr] = await run "node #{target}/index.js"
      process.stdout.write stdout if stdout.length > 0
      process.stderr.write stderr if stderr.length > 0

  # Generate target tasks for compiling, testing, publishing
  target = (description) ->
    {name} = description
    task "#{name}:compile:source", compile description.source
    task "#{name}:compile:tests", compile description.tests
    task "#{name}:compile",
     parallel "#{name}:compile:source", "#{name}:compile:tests"
    task "#{name}:tests:run", test description.tests
    task "#{name}:test",
      series "#{name}:compile", "#{name}:tests:run"
    task "#{name}:publish",
      series "#{name}:compile:source",
        -> await run description.publish

  target description for name, description of targets

  task "test",
    parallel ("#{name}:test" for name, _ of targets)...
  task "compile",
    parallel ("#{name}:compile" for name, _ of targets)...
  task "publish",
    parallel ("#{name}:publish" for name, _ of targets)...

  # Tag a release
  task "git:tag", ->
    {version} = module
    await run "git tag -am #{version} #{version}"
    await run "git push --tags"

  # Web site related tasks…
  task "www:server", ->
    gulp
    .src "build"
    .pipe webserver
        livereload: true
        port: 8000
        extensions: [ "html" ]

  task "www:clean", ->
    del "build"

  task "www:html", ->
    gulp
    .src [ "www/**/*.pug" ]
    .pipe pug {}
    .pipe dest "build"

  task "www:css", ->
    gulp
    .src "www/**/*.styl"
    .pipe stylus()
    .pipe dest "build"

  task "www:js", ->
    gulp
    .src "www/**/*.coffee", sourcemaps: true
    .pipe coffee
      coffee: coffeescript
      transpile:
        presets: [[ "env",
          targets: {browsers}
          modules: false ]]
    .pipe dest "www"

  task "www:images", ->
    gulp
    .src [ "www/images/**/*" ]
    .pipe dest "build/images"


  # watch doesn't take a task name for some reason
  # so we need to first define this as a function
  build = series "www:clean",
    parallel "www:html", "www:css", "www:js", "www:images"

  task "www:build", build

  task "www:watch", ->
    watch [ "www/**/*" ], build

  task "www",
    series "www:build",
      parallel "www:watch", "www:server"
