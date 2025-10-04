#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');

const projectRoot = path.resolve(__dirname, '.');
const srcDir = path.join(projectRoot, 'src', 'remote');
const entryFile = path.join(srcDir, 'main.js');
const outFile = path.join(projectRoot, 'build', 'sreality-enhance-remote.js');

const IMPORT_FROM_PATTERN = /(^|\n)\s*import\s+([^;]+?)\s+from\s+['"]([^'"]+)['"];?/g;
const IMPORT_SIDE_EFFECT_PATTERN = /(^|\n)\s*import\s+['"]([^'"]+)['"];?/g;

function resolveImportPath(fromFile, specifier) {
    if (!specifier.startsWith('.')) {
        throw new Error(`Only relative imports are supported (from ${fromFile} to ${specifier}).`);
    }
    const basePath = path.resolve(path.dirname(fromFile), specifier);
    if (path.extname(basePath)) {
        return basePath;
    }
    return `${basePath}.js`;
}

function stripExports(code) {
    let transformed = code;
    transformed = transformed.replace(/(^|\n)\s*export\s+default\s+function\s+([A-Za-z0-9_$]+)/g, '$1function $2');
    transformed = transformed.replace(/(^|\n)\s*export\s+default\s+class\s+([A-Za-z0-9_$]+)/g, '$1class $2');
    transformed = transformed.replace(/(^|\n)\s*export\s+default\s+/g, '$1const __defaultExport = ');
    transformed = transformed.replace(/(^|\n)\s*export\s+(const|let|var|function|class)\s+/g, '$1$2 ');
    transformed = transformed.replace(/(^|\n)\s*export\s*\{[^}]+\}\s*;?/g, '');
    return transformed;
}

function indent(code, level = 1) {
    const pad = '    '.repeat(level);
    return code
        .split('\n')
        .map((line) => {
            if (!line.trim()) {
                return '';
            }
            return pad + line;
        })
        .join('\n');
}

async function collectModules(entry) {
    const visited = new Set();
    const ordered = [];

    async function process(filePath) {
        const resolved = path.resolve(filePath);
        if (visited.has(resolved)) {
            return;
        }
        visited.add(resolved);

        let code = await fs.readFile(resolved, 'utf8');
        const dependencies = [];

        code = code.replace(IMPORT_FROM_PATTERN, (match, prefix, specifiers, specifier) => {
            const dependencyPath = resolveImportPath(resolved, specifier);
            dependencies.push(dependencyPath);
            return prefix || '\n';
        });

        code = code.replace(IMPORT_SIDE_EFFECT_PATTERN, (match, prefix, specifier) => {
            const dependencyPath = resolveImportPath(resolved, specifier);
            dependencies.push(dependencyPath);
            return prefix || '\n';
        });

        for (const dependency of dependencies) {
            await process(dependency);
        }

        const withoutExports = stripExports(code).trimEnd();
        ordered.push({ filePath: resolved, code: withoutExports });
    }

    await process(entry);
    return ordered;
}

async function bundle(entry) {
    const modules = await collectModules(entry);
    const banner = modules
        .map(({ filePath, code }) => {
            const relative = path.relative(srcDir, filePath) || path.basename(filePath);
            const header = `// ${relative}`;
            return `${indent(header)}\n${indent(code)}`;
        })
        .join('\n\n');

    return `(function () {\n    'use strict';\n\n${banner}\n})();\n`;
}

async function main() {
    try {
        const output = await bundle(entryFile);
        await fs.mkdir(path.dirname(outFile), { recursive: true });
        await fs.writeFile(outFile, output, 'utf8');
        console.log(`Built ${path.relative(projectRoot, outFile)} from entry ${path.relative(projectRoot, entryFile)}.`);
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

main();
