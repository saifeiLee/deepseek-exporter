import sucrase from "@rollup/plugin-sucrase";

const plugins = [
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
    })
]

export default [
    {
        plugins,
        input: 'lib/injections/reload.ts',
        output: {
            format: 'iife',
            file: 'build/injections/reload.tss',
        },
    },
    {
        plugins,
        input: 'lib/injections/refresh.ts',
        output: {
            format: 'iife',
            file: 'build/injections/refresh.js'
        }
    }
]