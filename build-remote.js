#!/usr/bin/env node
'use strict'

// Bundles TypeScript modules from src/remote into a single JavaScript file for remote loading

const fs = require('fs/promises')
const fsSync = require('fs')
const path = require('path')
const ts = require('typescript')

const projectRoot = path.resolve(__dirname, '.')
const srcDir = path.join(projectRoot, 'src', 'remote')
const entryFile = path.join(srcDir, 'main.ts')
const outFile = path.join(projectRoot, 'build', 'cdn', 'sreality-enhance-remote.js')

const IMPORT_FROM_PATTERN = /(^|\n)\s*import\s+(?:type\s+)?([^;]+?)\s+from\s+['"]([^'"]+)['"];?/g
const IMPORT_SIDE_EFFECT_PATTERN = /(^|\n)\s*import\s+['"]([^'"]+)['"];?/g
const SUPPORTED_EXTENSIONS = ['.ts', '.js']

function resolveImportPath(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    throw new Error(`Only relative imports are supported (from ${fromFile} to ${specifier}).`)
  }
  const basePath = path.resolve(path.dirname(fromFile), specifier)
  if (path.extname(basePath)) {
    if (!fsSync.existsSync(basePath)) {
      throw new Error(
        `Cannot resolve import ${specifier} from ${fromFile}. Expected file ${basePath}.`
      )
    }
    return basePath
  }
  for (const extension of SUPPORTED_EXTENSIONS) {
    const candidate = `${basePath}${extension}`
    if (fsSync.existsSync(candidate)) {
      return candidate
    }
  }
  throw new Error(`Cannot resolve import ${specifier} from ${fromFile}.`)
}

function stripExports(code) {
  let transformed = code
  transformed = transformed.replace(
    /(^|\n)\s*export\s+default\s+function\s+([A-Za-z0-9_$]+)/g,
    '$1function $2'
  )
  transformed = transformed.replace(
    /(^|\n)\s*export\s+default\s+class\s+([A-Za-z0-9_$]+)/g,
    '$1class $2'
  )
  transformed = transformed.replace(/(^|\n)\s*export\s+default\s+/g, '$1const __defaultExport = ')
  transformed = transformed.replace(/(^|\n)\s*export\s+(const|let|var|function|class)\s+/g, '$1$2 ')
  transformed = transformed.replace(/(^|\n)\s*export\s*\{[^}]+\}\s*;?/g, '')
  transformed = transformed.replace(/(^|\n)\s*export\s*\{\s*\}\s*;?/g, '$1')
  transformed = transformed.replace(/(^|\n)\s*export\s*;?/g, '$1')
  return transformed
}

function indent(code, level = 1) {
  const pad = '    '.repeat(level)
  return code
    .split('\n')
    .map(line => {
      if (!line.trim()) {
        return ''
      }
      return pad + line
    })
    .join('\n')
}

async function collectModules(entry) {
  const visited = new Set()
  const ordered = []

  async function process(filePath) {
    const resolved = path.resolve(filePath)
    if (visited.has(resolved)) {
      return
    }
    visited.add(resolved)

    const isTypeScript = path.extname(resolved) === '.ts'
    let code = await fs.readFile(resolved, 'utf8')
    const dependencies = []

    code = code.replace(IMPORT_FROM_PATTERN, (match, prefix, specifiers, specifier) => {
      const dependencyPath = resolveImportPath(resolved, specifier)
      dependencies.push(dependencyPath)
      return prefix || '\n'
    })

    code = code.replace(IMPORT_SIDE_EFFECT_PATTERN, (match, prefix, specifier) => {
      const dependencyPath = resolveImportPath(resolved, specifier)
      dependencies.push(dependencyPath)
      return prefix || '\n'
    })

    for (const dependency of dependencies) {
      await process(dependency)
    }

    let compiled = code
    if (isTypeScript) {
      const { outputText } = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2019,
          module: ts.ModuleKind.ESNext,
          importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove
        },
        fileName: resolved
      })
      compiled = outputText
    }

    const withoutExports = stripExports(compiled).trimEnd()
    ordered.push({ filePath: resolved, code: withoutExports })
  }

  await process(entry)
  return ordered
}

async function bundle(entry) {
  const modules = await collectModules(entry)
  const timestamp = new Date().toISOString()
  const banner = modules
    .map(({ filePath, code }) => {
      const relative = path.relative(srcDir, filePath) || path.basename(filePath)
      const header = `// ${relative}`
      return `${indent(header)}\n${indent(code)}`
    })
    .join('\n\n')

  return `// Build: ${timestamp}\n(function () {\n    'use strict';\n\n${banner}\n})();\n`
}

async function main() {
  try {
    const output = await bundle(entryFile)
    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, output, 'utf8')
    console.log(
      `Built ${path.relative(projectRoot, outFile)} from entry ${path.relative(projectRoot, entryFile)}.`
    )
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

main()
