import React from 'react'
import AlgoResults from './AlgoResults'

const MainContent = (props) => {
    const mainStyle = {
        display: 'flex',
    }

    return (
        <div style={mainStyle}>
            <div style={{width: '100%', justifyContent: "center", flexGrow: "1"}}>
                <AlgoResults onComplete={props.onComplete}/>
            </div>
        </div>
    )

}

export default MainContent
