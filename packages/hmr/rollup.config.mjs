import sucrase from "@rollup/plugin-sucrase";

const plugins = [
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
    })
]

export default {
    {
        plugins,
        // input:
    }
}