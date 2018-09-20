# If the file exists to require,
# the test passes :)

import "../src/index"

# test to make sure code generation is as expected
->
  i = -> yield i for await i from [1..5]
  for await x from i
    x
