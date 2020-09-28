import fs from "fs"
import { spawn } from "child_process"

export const readJSON = async (p) =>
  new Promise((resolve) => fs.readFile(p, (_, d) => resolve(JSON.parse(d))))

export const writeJSON = async (p, c) =>
  new Promise((resolve) =>
    fs.writeFile(p, JSON.stringify(c, "", "  "), () => resolve())
  )

export const run = async (p, cmd, ...a) => {
  return new Promise((resolve) => {
    console.log(`> ${cmd} ${a.join(" ")}`)
    const c = spawn(cmd, a, { cwd: p })
    c.stdout.on("data", (l) => console.log(l.toString().replace(/\n$/, "")))
    c.stderr.on("data", (l) => console.log(l.toString().replace(/\n$/, "")))
    c.on("close", (code) => resolve(code))
  })
}
