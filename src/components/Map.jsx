import React,{ useState, useEffect } from 'react'
import {MapContainer, TileLayer} from 'react-leaflet';
import axios from 'axios';
import Stop from './StopInfo.jsx'




function Map(props) {
    const position = [40.7127281,-74.0060152];
    const StopMonitoringAPI = "http://bustime.mta.info/api/siri/stop-monitoring.json?key=";
    const retrieveStopPositionAPI = "http://bustime.mta.info/api/where/stop/";
    const [stopsCoordinates,setStopsCoordinates] = useState([]);
    

   
    useEffect( () => {

      for (let i = 0; i < props.stopsMatrix.length; i++) {

        for (let j = 0; j < props.stopsMatrix[i].length; j++) {

          let latAndLon = {
            latitude:"",
            longitude:"",
          }
          
          axios.get(retrieveStopPositionAPI+props.stopsMatrix[i][j]+".json?key="+props.apiKey+"&&version=2")
          .then(response => {
            
            latAndLon.latitude = response.data.data.entry.lat;
            latAndLon.longitude = response.data.data.entry.lon;


            setStopsCoordinates( stopsCoordinates => [...stopsCoordinates,latAndLon]);
          })

        }
        
      }


      

    },[props.stopsMatrix] );


    
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stopsCoordinates.map( (stop,i) => {

          let stopPosition = [];
          stopPosition.push(stop.latitude);
          stopPosition.push(stop.longitude);


          return( 
          <Stop key={i}  position={stopPosition}/>
          );

        } )}
        
        
      </MapContainer>
    )
}

export default Map
