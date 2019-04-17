const fs = require('fs-extra')
const path = require('path')
const cheerio = require('cheerio')

exports = module.exports= function moveInlineScript(compiler) {
    fs.readdir(compiler.outputPath)
      .then(files => files.filter(file => /\.html$/.test(file)))
      .then(files => files.forEach(file => {
              fs.readFile(path.resolve(compiler.outputPath, file), 'utf8')
                .then(data => {
                    let $ = cheerio.load(data)
                    let container = $('script:not([src])')
                    if ( container.length === 0 ) return

                    let inlineScript = container.html()
                    let newFileName = `${file}_webpack_module`
                    let relativeSrc = (compiler.options.output.publicPath || '') + compiler.options.output.filename.replace('[name]', newFileName)

                    fs.outputFile(path.resolve(compiler.outputPath, relativeSrc), inlineScript)
                      .catch(err => console.log(err))

                    container.replaceWith(`<script src="${relativeSrc}"></script>`)

                    fs.outputFile(path.resolve(compiler.outputPath, file), $.html())
                      .catch(err => console.log(err))
                })
          })
      )
}
