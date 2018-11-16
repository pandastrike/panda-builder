import {tee} from "panda-garden"
import {merge} from "panda-parchment"
import _coffee from "coffeescript"

coffee = do (defaults = undefined) ->

  defaults =
    bare: true
    inlineMap: true

  (settings) ->
    tee ({source, target}) ->
      target.content = _coffee.compile source.content,
        merge defaults, settings, {filename: source.path}

export {coffee}
