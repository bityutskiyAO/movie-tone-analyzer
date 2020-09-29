const express = require('express')
const bodyParser = require('body-parser');
const utils = require('./utils')
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const router = express.Router()
router.use(bodyParser.json())

const IBM_API_KEY = 'aGDW9G4F4fIb9w0pfdNDSk_D6mjroKIiKyNh1S6kNG08'
const IBM_API_URL = 'https://api.eu-gb.tone-analyzer.watson.cloud.ibm.com/instances/a706a08a-6c5f-4d02-918b-0f4c8d0b1dba'

const handleSubtitleFile = async (req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    const resp = await utils.workWithSrtFile(req.body.searchingFilm)
    res.end(resp)
}

const handleIbmApi = async (req, res, next) => {
    const {subtitlesText} = req.body

    const toneAnalyzer = new ToneAnalyzerV3({
        version: '2017-09-21',
        authenticator: new IamAuthenticator({
            apikey: IBM_API_KEY,
        }),
        serviceUrl: IBM_API_URL,
        disableSslVerification: false
    });

    const toneParams = {
        toneInput: { 'text': subtitlesText },
        contentType: 'application/json',
    };

    toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            res.end(JSON.stringify(toneAnalysis))
        })
        .catch(err => {
            console.log('error:', err);
        });
}

module.exports = router
    .post('/get-subtitle-file', handleSubtitleFile)
    .post('/ibm-library', handleIbmApi)
