{resolve} = require "path"
{readFileSync, writeFileSync} = require "fs"
require "colors"
{run, print} = require "./run"

log = (message) -> console.error message

do ->


  # resolve relative to the build directory
  source = (resolve __dirname, "..", "..", "..", "template")
  target = resolve "."

  # add slash to tell rsync to sync contents
  commands = {
    sync: "rsync -ru #{source}/ #{target}"
    deps: "npm i -D github:gulpjs/gulp#4.0 coffeescript amen"
  }

  messages = {
    start: "Panda Builder project initialization:".blue
    sync: "Updating project files based on template...".green
    deps: "Installing common dependences...".green
    package: "Updating package.json...".green
    finish: "Done.".blue
  }

  log messages.start

  for code, command of commands
    log messages[code]
    await run command

  log messages.package
  do ->
    pkg = JSON.parse readFileSync "package.json", "utf8"
    pkg.license = "MIT"
    pkg.scripts.test = "gulp npm:test"
    writeFileSync "package.json", JSON.stringify pkg, null, 2




  log messages.finish
