import React, {useState} from 'react'
import {Input, Alert, Result} from "antd"
import _ from 'lodash'
import { SmileOutlined } from '@ant-design/icons'
import axios from 'axios'

import {API_KEY, SEARCH_FILM_URL} from "../../constants";
import {MovieCard} from "../index";

import './style.css'
import {ToneBarChart} from "../tone-bar-chart/tone-bar-chart";
import {SkeletonComponent} from "../skeleton/skeleton";


const sendApiRequest = (url, data) => {
    return axios.post(url, data)
}

const AnalyzeMovie = (props) => {
    const {Search} = Input
    const [movieData, setMovieData] = useState(null)

    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)

    const [ibmAnalyzerData, setIbmAnalyzerData] = useState(null)
    const [analyzerData, setAnalyzerData] = useState(null)

    const handleOnSearch = async (query) => {
        try {
            setError(false)
            setLoading(true)
            const filmDataResponse = await axios.get(`${SEARCH_FILM_URL}${API_KEY}/${query}`)
            const searchingFilm = filmDataResponse?.data?.results[0]
            const { id } = searchingFilm
            const movieData = await axios.get(`https://imdb-api.com/en/API/Title/${API_KEY}/${id}/Ratings`)
            const {image, title, fullTitle, year, plot, directors, writers, stars, genres, companies, countries, imDbRating, contentRating} = movieData.data

            setMovieData({
                id,
                image,
                title,
                fullTitle,
                year,
                plot: plot,
                directors,
                writers,
                stars: stars.split(',').slice(0, 3).join(',') + '...',
                genres,
                companies,
                countries,
                imDbRating,
                contentRating
            })
            const subtitlesReqData = {
                id,
                title
            }
            const subtitlesResponse = await axios.post('/api/get-subtitle-file', {searchingFilm: subtitlesReqData})
            const {data: subtitlesText} = subtitlesResponse

            if (subtitlesText) {
                let clearSubtitles = subtitlesText.replaceAll('"', '')
                clearSubtitles = clearSubtitles.replace(/[\r\n]+/g, '')

                Promise.all([sendApiRequest('/api/ibm-library', {subtitlesText: clearSubtitles}), sendApiRequest('/api/microsoft-api', { subtitlesText: clearSubtitles.substring(0, 5100)})])
                    .then((responses) => {
                        const [ibmResp, microsoftResp] = responses
                        const { result: { document_tone: { tones: ibmData } } } = ibmResp?.data
                        const { data: microsoftData } = microsoftResp

                        const tonesApiDataForBarChart = {}
                        _.forIn(microsoftData, (value, key) => tonesApiDataForBarChart[key] = value * 100)
                        setAnalyzerData(tonesApiDataForBarChart)
                        const tonesIBMDataForBarChart = ibmData.reduce((acc, tone) => {
                            return {
                                ...acc,
                                [tone.tone_name]: tone.score * 100
                            }
                        }, [])

                        setIbmAnalyzerData(tonesIBMDataForBarChart)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log('ERROR', error)
                        setLoading(false)
                        setError(true)
                    })
            } else {
                setLoading(false)
                setError(true)
            }

        } catch (e) {
            console.error(e)
            setLoading(false)
            setError(true)
        }
    }

    const renderBarChart = (data, title) => {
        return (
        data && !isLoading && !isError &&
            <div className='bar-chart-container'>
                <h3 className='bar-charts-header'>{title}</h3>
                <ToneBarChart
                    data={data}
                />
            </div>
        )
    }

    return (
        <div className='analyze-movie-container'>
            <div className='search-container'>
                <Search
                    size='large'
                    placeholder="Enter movie name here"
                    onSearch={handleOnSearch}
                    enterButton
                />
            </div>
            {!isLoading && !isError && !analyzerData && !ibmAnalyzerData &&
                <Result
                    icon={<SmileOutlined />}
                    title="Hello, let's try to analyze some movie!"
                />

            }
            {isError &&
                <Alert
                    className='analyze-movie-alert'
                    message="Failed while loading subtitles"
                    description="Problem with subtitles, try another movie name"
                    type="error"
                    showIcon
                />
            }
            {isLoading &&
                <SkeletonComponent/>
            }
            {movieData && !isLoading && !isError &&
                <MovieCard
                    isLoading={isLoading}
                    movieData={movieData}
                />
            }
            <div className='analyze-bar-chart'>
                {renderBarChart(ibmAnalyzerData, 'IBM Neuronal Tone Analyzer')}
                {renderBarChart(analyzerData, 'Microsoft Neuronal Tone Analyzer')}
            </div>
        </div>
    )
}

export default AnalyzeMovie
