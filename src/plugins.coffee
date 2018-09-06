coffeescript = require "coffeescript"

{tee, content, resolve, merge} = require "./helpers"

extension = (extension) -> tee (file) -> file.extname = extension


coffee = (settings) ->

    content (code, file) ->

        do (defaults = undefined) ->

          defaults =
            bare: true
            inlineMap: true
            filename: file.relative
            transpile: do ->
              # we don't require the preset
              # if you're not actually using it
              if !settings.transpile?
                presets: [[ resolve "babel-preset-stage-3" ]]

          coffeescript.compile code, merge defaults, settings

module.exports = {extension, coffee}
