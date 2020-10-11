import React from 'react'
import Skeleton from "react-loading-skeleton";

export const DescriptionItem = ({title, value, isLoading}) => (
    <div className='movie-card-description-item'>
        <span style={{ color: 'rgba(31,31,31,.5)', fontSize: '16px', width: '120px'}}>{isLoading ? <Skeleton /> : `${title}:` }</span>
        <span style={{fontSize: '16px', width: '70%', marginLeft: '2em'}} >{isLoading ? <Skeleton /> : value}</span>
    </div>
)
