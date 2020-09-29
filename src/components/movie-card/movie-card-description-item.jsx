import React from 'react'

export const DescriptionItem = ({title, value}) => (
    <div className='movie-card-description-item'>
        <span style={{ color: 'rgba(31,31,31,.5)', fontSize: '16px', width: '120px'}}>{title}: </span>
        <span style={{fontSize: '16px', width: '70%', marginLeft: '2em'}} >{value}</span>
    </div>
)
