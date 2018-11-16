{tools} = require "panda-builder"
p9k = require "panda-9000"

{curry, binary, tee} = require "panda-garden"
{include} = require "panda-parchment"
{resolve, relative, join, parse} = require "path"
{mkdirp, write} = require "panda-quill"

{target} = tools p9k

target "npm"
target "web"
