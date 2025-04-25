import fs from 'node:fs'
import path from 'node:path'
import esbuild from 'esbuild'
import {rimraf} from 'rimraf'

async function build() {
    await esbuild.build({
        entryPoints: ['./index.ts'],
        tsconfig: './tsconfig.json',
        bundle: true,
        packages: 'bundle',
        target: 'es6',
        outdir: './dist',
        sourcemap: true,
        format: 'esm',
    })
}

void build()