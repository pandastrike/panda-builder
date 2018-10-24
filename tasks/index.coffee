# import tools from "./src"
# import p9k from "panda-9000"

{tools} = require "../build/npm/src"
p9k = require "panda-9000"

{target} = tools p9k

target "npm"
