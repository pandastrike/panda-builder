import {tee} from "panda-garden"
import {read} from "panda-quill"
import _pug from "pug"
import _coffee from "coffeescript"
import _stylus from "stylus"

# options exposes the Pug API's compile options.
pug = (options={}) ->
  ({source, target, data}) ->
    source.content ?= await read source.path
    options.filename = source.path
    render = _pug.compile source.content, options
    target.content = render data

stylus = ({source, target}) ->
  source.content ?= await read source.path
  target.content = await promise (resolve, reject) ->
    _stylus.render source.content, filename: source.path,
      (error, css) -> unless error? then resolve css else reject error

coffee = do (
  defaults =
    bare: true
    inlineMap: true
) ->
  (settings) ->
    tee ({source, target}) ->
      source.content ?= await read source.path
      target.content = coffeescript.compile source.content,
        merge defaults, settings, {filename: file.relative}

extension = (extension) -> ({target}) -> target.extension = extension

export {pug, stylus, coffee, extension}
