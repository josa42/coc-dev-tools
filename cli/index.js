#!/usr/bin/env node

import os from "os"
import path from "path"

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { readJSON, run, writeJSON } from "../src/utils.js"

const home = os.homedir()
const pwd = process.cwd()

const cocPath = path.join(home, ".config", "coc", "extensions")
const cocPkgPath = path.join(cocPath, "package.json")

const extPkgPath = path.join(pwd, "package.json")

yargs(hideBin(process.argv))
  .command(
    "link",
    "link coc extension",
    (_yargs) => {},
    async (_argv) => {
      const extPkg = await readJSON(extPkgPath)

      const cocPkg = await readJSON(cocPkgPath)
      cocPkg.dependencies[extPkg.name] = "*"
      await writeJSON(cocPkgPath, cocPkg)

      await run(".", "yarn", "link")
      await run(cocPath, "yarn", "link", extPkg.name)
    }
  )
  .command(
    "unlink",
    "unlink coc extension",
    (_yargs) => {},
    async (_argv) => {
      const extPkg = await readJSON(extPkgPath)

      await run(".", "yarn", "unlink")
      await run(cocPath, "yarn", "unlink", extPkg.name)

      const pkg = await readJSON(cocPkgPath)
      delete pkg.dependencies[extPkg.name]
      await writeJSON(cocPkgPath, pkg)

      await run(cocPath, "yarn", "add", extPkg.name)
    }
  )
  .demandCommand(1).argv
