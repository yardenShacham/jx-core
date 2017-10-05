'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const pkg = require('./package.json');
const typescript = require('rollup-plugin-typescript');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const fsExtra = require('fs-extra');

// Clean up the output directory
// Compile source code into a distributable format with Babel
// Copy package.json and LICENSE.txt
Promise.resolve().then(() => del(['dist/*']))
    .then(() => rollup.rollup({
        entry: 'src/index.ts',
        external: Object.keys(pkg.dependencies),
        plugins: [
            typescript(),
            uglify({}, minify)
        ],
    }).then(bundle => bundle.write({
        dest: `dist/index.js`,
        format: "umd",
        sourceMap: true,
        moduleName: "jxCore",
    }).then(() => {
        delete pkg.private;
        delete pkg.devDependencies;
        delete pkg.scripts;
        delete pkg.babel;
        fsExtra.copySync('src', 'dist/src');
        fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
        fs.writeFileSync('dist/LICENSE', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
    }).catch(err => console.error(err.stack))));