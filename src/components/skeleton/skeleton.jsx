import React from 'react'
import Skeleton from 'react-loading-skeleton'
import './style.css'

export const SkeletonComponent = () => (
    <div className='skeleton-container'>
        <Skeleton height={500} width={300}/>
        <div className='skeleton-movie-data'>
            <h1>
                <Skeleton height={40} width={150}/>
            </h1>
            <Skeleton height={24} count={9} width={`100%`}/>
        </div>
    </div>
)
