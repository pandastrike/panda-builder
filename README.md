# Build Tools

Shared tooling for building Fairmont packages, among others.

# Usage

```
tools = require "fairmont-build-tools"
{target} = tools require "gulp"

target "npm"
```

This will get you the tasks associated with the `npm` target preset. This includes:

- `npm:build` — Compiles CoffeeScript in `lib` to `build/npm/lib` and CoffeeScript tests in `test` to `build/npm/test`.

- `npm:test` — Runs the compiled tests.

- `npm publish` — Publishes to NPM.

# Presets

The only meaningful preset at this time `npm`. Presets `esm` and `www` are reserved. Don't use these as tasks prefixes.

# Built-In Tasks

The tasks `build`, `test`, and `publish` are all defined to iterate on active targets (any targets for which tasks have been defined) and execute the corresponding tasks, ex: `npm:build`.

In addition, these tasks are also defined:

- `git:tag` — Tag the current release using the version in the `package.json` file and push the tags to master. Runs automatically on `npm:publish`.

- `clean` — Deletes the entire `build` directory. Since each target defines it's own clean task (which should delete the target directory), you shouldn't need this.

# Configuring `package.json`

Remember, the files you're publishing will be in `build/npm`. The `files`, `directories`, and `main` properties should reflect this. Define `test` to be `gulp test`.

# Watching Files

Coming soon.
