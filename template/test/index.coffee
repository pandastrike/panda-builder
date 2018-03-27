import assert from "assert"
import CSS from "../src"
import {print, test} from "amen"

do ->

  print await test "PROJECT NAME", [

    test "TEST NAME", ->
      assert true

  ]
