const express = require('express')
const bodyParser = require('body-parser');
const utils = require('./utils')
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const { IamAuthenticator } = require('ibm-watson/auth');

const router = express.Router()
router.use(bodyParser.json())

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
            apikey: process.env.REACT_APP_IBM_API_KEY,
        }),
        serviceUrl: process.env.REACT_APP_IBM_API_URL,
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
            console.log('error:', err)
            res.status = 500
            res.end(err)
        });
}

const handleMicrosoftApi = async (req, res, next) => {
    const { subtitlesText } = req.body

    const textAnalyticsClient = new TextAnalyticsClient(process.env.REACT_APP_MICROSOFT_API_ENDPOINT, new AzureKeyCredential(process.env.REACT_APP_MICROSOFT_API_KEY));
    try {
        const sentimentResult = await textAnalyticsClient.analyzeSentiment([subtitlesText]);
        res.setHeader('Content-Type', 'application/json')
        console.log('sentimentResult.confidenceScores', sentimentResult[0].confidenceScores)
        res.end(JSON.stringify(sentimentResult[0].confidenceScores))
    } catch (e) {
        res.status = 500
        res.end(e)
    }

}

module.exports = router
    .post('/get-subtitle-file', handleSubtitleFile)
    .post('/ibm-library', handleIbmApi)
    .post('/microsoft-api', handleMicrosoftApi)
