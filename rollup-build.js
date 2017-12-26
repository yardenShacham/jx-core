'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const pkg = require('./package.json');
const typescript = require('rollup-plugin-typescript');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const fsExtra = require('fs-extra');

const inputOptions = {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies),
    plugins: [
        typescript(),
        uglify({}, minify)
    ]
}
const outputOptions = {
    file: 'dist/bundle.js',
    format: "umd",
    globals: {
        "jx-injector": 'jxInjector'
    },
    name: "jxCore",
    sourcemap: true
}
// generate code and a sourcemap
//const { code, map } = await bundle.generate(outputOptions);
async function build() {
    //create new bundle
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
    //copy and clear unnessery code
    onBuildDone();
}

function onBuildDone() {
    delete pkg.private;
    delete pkg.devDependencies;
    delete pkg.scripts;
    delete pkg.babel;
    fsExtra.copySync('src', 'dist/src');
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
    fs.writeFileSync('dist/LICENSE', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
}

build();