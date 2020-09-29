import React, {useState} from 'react'
import {Input, Alert, Result} from "antd"
import { SmileOutlined } from '@ant-design/icons'
import axios from 'axios'

import {API_KEY, SEARCH_FILM_URL, TONE_NOT_IBM_API_KEY} from "../../constants";
import {Loader, MovieCard} from "../index";

import './style.css'
import {ToneBarChart} from "../tone-bar-chart/tone-bar-chart";

const AnalyzeMovie = (props) => {
    const {Search} = Input
    const [movieData, setMovieData] = useState(null)

    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)

    const [ibmAnalyzerData, setIbmAnalyzerData] = useState(null)
    const [analyzerData, setAnalyzerData] = useState(null)

    console.log(movieData)
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
                plot: plot.slice(0, 300) + '...',
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

                const ibmResp = await axios.post('/api/ibm-library', {subtitlesText: clearSubtitles})
                const { result: { document_tone: { tones } } } = ibmResp?.data

                const anotherApiResp = await axios.post('https://api.promptapi.com/text_to_emotion', clearSubtitles.substring(0, 500), {
                    headers: {
                        'apikey': TONE_NOT_IBM_API_KEY
                    }
                })
                console.log('anotherApiResp', anotherApiResp.data)
                setAnalyzerData(anotherApiResp.data)
                const tonesDataForBarChart = tones.reduce((acc, tone) => {
                    return {
                        ...acc,
                        [tone.tone_name]: tone.score * 100
                    }
                }, [])

                setIbmAnalyzerData(tonesDataForBarChart)
                setLoading(false)
            } else {
                setLoading(true)
                setError(true)
            }

        } catch (e) {
            console.error(e)
            setLoading(false)
            setError(true)
        }
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
                <>
                    <Result
                        title="Your operation has been executed. Relax and wait."
                    />
                    <Loader/>
                </>
            }
            {movieData && !isLoading && !isError &&
                <MovieCard
                    movieData={movieData}
                />
            }
            <div className='analyze-bar-chart'>
                {ibmAnalyzerData && !isLoading && !isError &&
                    <div>
                        <h3 className='bar-charts-header'>IBM Tone Analyzer Neuronal web results</h3>
                        <ToneBarChart
                            data={ibmAnalyzerData}
                        />
                    </div>
                }
                {analyzerData && !isLoading && !isError &&
                    <div>
                        <h3 className='bar-charts-header'>Another free Tone Analyzer Neuronal web results</h3>
                        <ToneBarChart
                            data={analyzerData}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default AnalyzeMovie
