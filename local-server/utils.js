const fs = require('fs')
const http = require('http')
const OS = require('opensubtitles-api')
const { parse, stringify, map } = require('subtitle')

const OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    username: 'bitAndr',
    password: 'Natajtl2605'
})

const workWithSrtFile = (searchingFilm) => {
    const {id, title} = searchingFilm
    let allSubtitlesText = ''
    return OpenSubtitles
        .login()
        .then((res) => {
           return OpenSubtitles
                .search({
                    imdbid: id,
                    query: title
                })
        })
        .then((subtitles) => {
            const { url } = subtitles.en
            const writeStream = fs.createWriteStream('./local-server/output-files/subtitles.json')

            return new Promise((resolve, reject) => {
                http.get(url, (response) => {
                    response
                        .pipe(parse())
                        .pipe(map(node => {
                            allSubtitlesText += node.data.text
                            return node
                        }))
                        .pipe(stringify({ format: 'WebVTT' }))
                        .pipe(writeStream)
                        .on('finish', () => {
                            resolve(allSubtitlesText)
                        })
                        .on('error', (err) => {
                            reject(err)
                        })
                })
            })
        })
        .then((subtitlesText) => {
            return subtitlesText
        })
        .catch((err) => {
            console.error(err)
            return err
        })
}

module.exports = {
    workWithSrtFile
}
