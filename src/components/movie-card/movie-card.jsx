import React, {useEffect, useState} from 'react'
import {Image, Skeleton} from "antd"
import {StarOutlined } from '@ant-design/icons'

import {DescriptionItem} from "./movie-card-description-item";

import './style.css'

const MovieCard = (props) => {
    const {movieData} = props
    const {image, title, fullTitle, year, plot, directors, writers, stars, genres, companies, countries, imDbRating, contentRating} = movieData

    const [isImageLoading, toggleImageLoading ] = useState(true)


    useEffect(() => {
        const movieImg = document.getElementById('movieImg')
        movieImg.addEventListener('load', () => {
            toggleImageLoading(false)
            movieImg.classList.add('loaded')
        })
        return () => {
            movieImg.removeEventListener('load', () => {
                toggleImageLoading(true)
                console.log('Listener removed')
            })
        }
    }, [])

    const renderMovieData = () => {
        const relevantData = [
            {
                title: 'Release year',
                value: year
            },
            {
                title: 'Country',
                value: countries
            },
            {
                title: 'Company',
                value: companies
            },
            {
                title: 'Genre',
                value: genres
            },
            {
                title: 'Content rating',
                value: contentRating
            },
            {
                title: 'Director',
                value: directors
            },
            {
                title: 'Writers',
                value: writers
            },
            {
                title: 'Stars',
                value: stars
            },
            {
                title: 'Plot',
                value: plot
            },
        ]

        return relevantData.map((item) => {
            return item.value ? <DescriptionItem title={item.title} value={item.value} /> : null
        })
    }

    return (
        movieData &&
        <div className='movie-card-container'>
            <div className='movie-card-image-container'>
                {isImageLoading &&
                    <Skeleton.Image
                        className='movie-img-skeleton'
                    />
                }
                <img
                    id='movieImg'
                    className='movie-card-image'
                    src={image}
                    alt='Здесь должна быть ваша реклама'
                />
            </div>
            <div className='movie-card-data'>
                <div className='data-header-container'>
                    <h1>{fullTitle || title}</h1>
                    <h2 className='data-rating'>
                        {imDbRating} <StarOutlined style={{ color: '#F5C518' }} />
                    </h2>
                </div>
                <div className='data-description-container'>
                    {renderMovieData()}
                </div>
            </div>
        </div>
    )
}

export default MovieCard
