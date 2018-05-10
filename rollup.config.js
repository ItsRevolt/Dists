import typescript from 'rollup-plugin-typescript2';
import includePaths from 'rollup-plugin-includepaths';
import uglify from 'rollup-plugin-uglify';

let includePathOptions = {
    include: {},
    paths: ['src/'],
    external: [],
    extensions: ['.js', '.json', '.ts']
};
export default {
    input: 'src/index.ts',
    output: [{
        name: 'Dists',
        file: 'build/dists.js',
        format: 'cjs'
    }],
    plugins: [
        typescript(),
        includePaths(includePathOptions),
        uglify(),
    ]
}