{resolve} = require "path"
require "colors"
{run, print, log} = require "./run"

do ->

  commands = {
    install: -> run "npm i -D panda-builder @babel/core @babel/preset-env"
    rebuild: -> run "npm test"
    bump: -> run "npm version patch --no-git-tag-version"
    commit: -> run "git commit package.json package-lock.json
      -m 'Update to latest panda-builder.'"
    push: -> run "git push"
    publish: -> run "npx gulp npm:publish"
    tag: -> run "npx gulp git:tag"
  }

  messages = {
    start: "Starting update...".blue
    install: "Installing update...".green
    rebuild: "Building and verifying...".green
    bump: "Bumping patch version...".green
    commit: "Comitting changes...".green
    push: "Pushing changes...".green
    publish: "Publishing package to registry".green
    tag: "Tagging version...".green
    done: "Done.".blue
    error: "Error: update failed.".red
  }

  log messages.start

  for code, command of commands
    log messages[code]
    try
      await command()
    catch error
      log messages.error
      log error.message.red
      process.exit -1

  log messages.done
