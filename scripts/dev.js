'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err
})

// Ensure environment variables are read.
require('../config/env')


const path = require('path')
const chalk = require('react-dev-utils/chalk')
const fs = require('fs-extra')
const webpack = require('webpack')
const bfj = require('bfj')
const configFactory = require('../config/webpack.config')
const paths = require('../config/paths')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const moveInlineScript = require('./moveInlineScript')

console.log(moveInlineScript)
const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const useYarn = fs.existsSync(paths.yarnLockFile)

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const isInteractive = process.stdout.isTTY

// Warn and crash if required files are missing
if ( !checkRequiredFiles([paths.appHtml, paths.appIndexJs]) ) {
    process.exit(1)
}

// Process CLI arguments
const argv = process.argv.slice(2)
const writeStatsJson = argv.indexOf('--stats') !== -1

// Generate configuration
const config = configFactory('production')

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
checkBrowsers(paths.appPath, isInteractive)
.then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild)
})
.then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild)
    // Merge with the public folder
    copyPublicFolder()
    // Start the webpack build
    return build(previousFileSizes)
})
.then(
    ({ stats, previousFileSizes, warnings }) => {
        if ( warnings.length ) {
            console.log(chalk.yellow('Compiled with warnings.\n'))
            console.log(warnings.join('\n\n'))
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            )
            console.log(
                'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
            )
        } else {
            console.log(chalk.green('Compiled successfully.\n'))
        }

        console.log('File sizes after gzip:\n')
        printFileSizesAfterBuild(
            stats,
            previousFileSizes,
            paths.appBuild,
            WARN_AFTER_BUNDLE_GZIP_SIZE,
            WARN_AFTER_CHUNK_GZIP_SIZE
        )
        console.log()

        const appPackage = require(paths.appPackageJson)
        const publicUrl = paths.publicUrl
        const publicPath = config.output.publicPath
        const buildFolder = path.relative(process.cwd(), paths.appBuild)
        printHostingInstructions(
            appPackage,
            publicUrl,
            publicPath,
            buildFolder,
            useYarn
        )
    },
    err => {
        console.log(chalk.red('Failed to compile.\n'))
        printBuildError(err)
        process.exit(1)
    }
)
.catch(err => {
    if ( err && err.message ) {
        console.log(err.message)
    }
    process.exit(1)
})

// Create the production build and print the deployment instructions.
async function build(previousFileSizes) {
    console.log('Creating an optimized production build...')

    let compiler = webpack(config)
    // watchMode watchFileSystem
    // console.log(compiler.watchFileSystem);
    return new Promise((resolve, reject) => {
        compiler.watch(Object.assign(config, { watch : true }), (err, stats) => {
            if ( err || stats.hasErrors() ) {console.log(err)}

            console.log('watch ok')
            // 将webpack打包的inlineScript 打包成单独文件
            if ( compiler.outputPath ) {
                moveInlineScript(compiler)
            }
        })
    })
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference : true,
        filter : file => file !== paths.appHtml,
    })
}
