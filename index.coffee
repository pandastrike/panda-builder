import assert from "assert"
import CSS from "../src"
import {print, test} from "amen"
{s, p, render, rem, pct, scale} = CSS

do ->

  print await test "VCSS", [

    test "helpers and nested selectors", ->

      rhythm = (lineHeight, fontSize) -> [
        p "font-size", scale lineHeight, fontSize
        p "line-height", lineHeight
      ]

      css = render s "article", [
        s "& > h1", [
          rhythm (rem 4), (pct 90)
        ]

        s "& > p", [
          p "font-face", "Montserrat"
        ]
      ]

      assert.equal css, """
        article > h1 { font-size: 3.6rem; line-height: 4rem; }
        article > p { font-face: Montserrat; }
       """
  ]
