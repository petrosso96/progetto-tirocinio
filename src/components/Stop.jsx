import React,{useEffect} from 'react';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';





function StopInfo(props) {

    const StopMonitoringAPI = "http://bustime.mta.info/api/siri/stop-monitoring.json?key=";


    return (
        <Marker position={props.position}>
            <Popup>
                
            </Popup>
        </Marker>
    )
}

export default StopInfo