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

      coffeescript.compile code, merge defaults, settings

module.exports = {extension, coffee}
