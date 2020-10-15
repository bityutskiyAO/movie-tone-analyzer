import React, {useState} from 'react'
import Skeleton from "react-loading-skeleton";
import { Button } from "antd";

export const DescriptionItem = ({title, value, isLoading}) => {
    const [itemValue, setValue] = useState(value.slice(0, 300))
    const [isExpand, toggleExpand] = useState(false)
    return (
        <div className='movie-card-description-item'>
            <span style={{ color: 'rgba(31,31,31,.5)', fontSize: '16px', width: '120px'}}>{isLoading ? <Skeleton /> : `${title}:` }</span>
            <span style={{fontSize: '16px', width: '70%', marginLeft: '2em'}} >{isLoading ? <Skeleton /> : title === 'Plot' ? itemValue : value} {title === 'Plot' && !isExpand ?  <Button type="link" onClick={() => { setValue(value); toggleExpand(true)}}> Expand</Button> : null}</span>
        </div>
    )
}
