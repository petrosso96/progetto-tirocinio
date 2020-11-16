import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import Timetable from '../Timetable'

function StopInfo(props) {
    return (
        <Marker position={props.position}>
            <Popup>
                <Timetable/>
            </Popup>
        </Marker>
    )
}

export default StopInfo