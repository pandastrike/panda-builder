# Helpers to run external programs
sh = do ->
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

log = (message) -> console.error message


export {sh, print, log}
