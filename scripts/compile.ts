import type { TaskCallback } from 'undertaker'

import { basename } from 'path'
import darkVars from './darkVars'
import writeThemeFile from './theme'
import writeVersionFile from './version'
import { getRootPath } from './interface'
import transformLess from './transformLess'
import { replace, startCase } from 'lodash-unified'
import { name, version, description, author } from '../package.json'

import gulp from 'gulp'
import rimraf from 'rimraf'
import glob from 'fast-glob'
import { build } from 'vite'
import through2 from 'through2'
import { rollup } from 'rollup'
import dts from 'vite-plugin-dts'
import icons from 'unplugin-icons'
import vue from '@vitejs/plugin-vue'
import banner from 'vite-plugin-banner'
import esbuild from 'rollup-plugin-esbuild'
import vueJsx from '@vitejs/plugin-vue-jsx'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'

const esDir = getRootPath('es')
const libDir = getRootPath('lib')
const umdDir = getRootPath('dist')
const pkgDir = getRootPath('packages')
const typingsDir = getRootPath('typings')

const target = 'es2018'
const info = `/**\n * name: ${name}\n * version: v${version}\n * description: ${description}\n * author: ${author}\n * Copyright 2021-present\n * Released under the MIT License.\n */`

async function dist(minify = true) {
    console.log(`[series] Compile to umd ${minify ? 'minify': ''}`)
    rimraf.sync(umdDir)
    rimraf.sync(typingsDir)

    const plugins = [
        vue(),
        vueJsx(),
        icons.vite({ compiler: 'vue3' }),
        banner(info)
    ]

    if (minify) { plugins.push(dts({ outputDir: 'typings' })) }

    await build({
        build: {
            target,
            minify: minify ? 'esbuild' : false,
            outDir: 'dist',
            sourcemap: minify,
            emptyOutDir: false,
            lib: {
                entry: getRootPath('packages', 'index.ts'),
                formats: ['umd'],
                name: replace(startCase(name), /\s/g, ''),
                fileName: format => `wanderer.${format}${minify ? '.min' : ''}.js`
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    exports: 'named',
                    globals: {
                        vue: 'Vue'
                    }
                },
                plugins: [optimizeLodashImports()]
            }
        },
        plugins
    })
}

async function style(minify = true, dark = false) {
    console.log(`[series] Compile to style ${dark ? 'dark' : ''} ${minify ? 'minify': ''}`)

    await build({
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: dark ? darkVars : undefined
                }
            }
        },
        esbuild: {
            sourcemap: minify,
        },
        build: {
            minify,
            emptyOutDir: false,
            lib: {
                name: replace(startCase(name), /\s/g, ''),
                entry: getRootPath('packages', 'style.ts'),
                formats: ['umd']
            },
            rollupOptions: {
                output: {
                    dir: umdDir,
                    assetFileNames: `wanderer${dark ? '.dark' : ''}${minify ? '.min' : ''}.css`,
                    entryFileNames: 'style.js'
                }
            }
        }
    })

    // 完全不知道下面为啥生成不出文件也不报错 猜测是 Tree-shaking
    // await rollup({
    //     input: getRootPath('packages', 'style.ts'),
    //     output: {
    //         dir: umdDir,
    //         assetFileNames: `wanderer${dark ? '.dark' : ''}${minify ? '.min' : ''}.css`,
    //         entryFileNames: 'style.js'
    //     },
    //     plugins: [
    //         nodeResolve({
    //             extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx']
    //         }),
    //         styles({
    //             mode: 'extract',
    //             minimize: minify,
    //             sourceMap: minify,
    //             less: {
    //                 modifyVars: dark ? darkVars : undefined,
    //                 javascriptEnabled: true
    //             }
    //         }),
    //         del({ targets: 'dist/style.js' })
    //     ]
    // })

}

async function locale(minify = true) {
    console.log(`[series] Compile to locale ${minify ? 'minify': ''}`)

    const files = await glob('packages/locales/*.ts', {
        absolute: true
    })

    await Promise.all(files.map(async file => {
        const filename = basename(file, '.ts')
        const bundle = await rollup({
            input: file,
            plugins: [
                esbuild({
                    minify,
                    sourceMap: minify,
                    target
                })
            ]
        })

        await bundle.write({
            format: 'umd',
            file: getRootPath('dist', 'locales', `${filename}${minify ? '.min' : ''}.js`),
            exports: 'default',
            name: filename,
            sourcemap: minify,
            banner: info
        })
    }))
}

async function compile(modules = true) {
    const format = modules ? 'cjs' : 'es'
    console.log(`[Parallel] Compile to  ${format}`)
    const dir = modules ? libDir : esDir
    rimraf.sync(dir)

    gulp.src(['packages/**/*.less']).pipe(
        through2.obj(async function(file, encoding, next) {
            // copy file less
            const lessFile = file.clone()
            const content = file.contents.toString().replace(/^\uFEFF/, '')
            lessFile.contents = Buffer.from(content)
            const cssFile = lessFile.clone()
            this.push(lessFile)

            if (/(\/|\\)style(\/|\\)index\.less$/.test(file.path)) {
                const css = await transformLess(cssFile.contents.toString(), cssFile.path)
                cssFile.contents = Buffer.from(css)
                cssFile.path = cssFile.path.replace(/\.less$/, '.css')
                this.push(cssFile)
            }

            next()
        })
    ).pipe(gulp.dest(dir))

    const source = [
        '**/*.{js,jsx,ts,tsx}',
        '!**/__tests__/*',
        // '!**/locales.ts' // Generated an empty chunk: "locales" 
    ]

    const input = await glob(source, { cwd: pkgDir, absolute: true, onlyFiles: true })
    const bundle = await rollup({
        input,
        plugins: [
            vue({ isProduction: false }),
            vueJsx(),
            nodeResolve({
                extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx']
            }),
            commonjs(),
            icons.rollup({ compiler: 'vue3' }),
            esbuild({
                sourceMap: true,
                target,
                loaders: {
                    '.vue': 'ts'
                }
            })
        ],
        external: (source: string) => {
            // 外部依赖没处理好 可能会导致 less css 路径不对
            return ['vue', '@vue', 'lodash', '@floating', /\.less|\.css/].some(pkg => {
                return pkg instanceof RegExp ? pkg.test(source) : (source === pkg || source.startsWith(pkg))
            })
        }
    })

    await bundle.write({
        dir,
        format,
        exports: modules ? 'named' : undefined,
        preserveModulesRoot: 'packages',
        preserveModules: true,
        sourcemap: true,
        entryFileNames: '[name].js'
    })
}

async function compileLib(done: TaskCallback) {
    await Promise.all([dist(false), dist()])
    await Promise.all([style(false), style(), style(false, true), style(true, true)])
    await Promise.all([locale(false), locale()])
    await writeThemeFile()
    rimraf.sync('dist/style.js')
    done()
}

async function compileWith(done: TaskCallback) {
    await Promise.all([compile(false), compile()])
    done() 
}

gulp.task('compile', gulp.series(
    async done => await writeVersionFile(done),
    gulp.parallel(async done => await compileLib(done), async done => await compileWith(done))
))
