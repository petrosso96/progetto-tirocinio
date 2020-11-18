import React,{ useState, useEffect,useContext } from 'react'
import {MapContainer, TileLayer} from 'react-leaflet';
import axios from 'axios';
import {StopsContext} from './StopsContext'
import Stop from './Stop'



function Map(props) {
    const [position,setPosition] = useState( [40.7127281,-74.0060152] );
    const [routeWithStopsId,setRouteWithStopsId] = useContext(StopsContext);
    const [isReadyToRender,setIsReadyToRender] = useState(false);
    const retrieveStopPositionAPI = "http://bustime.mta.info/api/where/stop/";
    

    useEffect(() => {

      setRouteWithStopsId(routeWithStopsId => [...routeWithStopsId,{xxx:"xxx"}]);

    },[routeWithStopsId]);

    useEffect(() => {


    },)

    const getCoordinatesOfStops = (stopsData) => {

      let coupleOfCoordinates = [];
      console.log(stopsData)



        //for(var i = 0;i < stopsData.stopIds.length;++i){console.log("dfg")

          let latAndLon = {
            latitude:"",
            longitude:"",
          }

          axios.get(retrieveStopPositionAPI+stopsData+".json?key="+props.apiKey+"&&version=2")
          .then(response => {
            
            latAndLon.latitude = response.data.data.entry.lat;
            latAndLon.longitude = response.data.data.entry.lon;

            
          });


        
      // }

      return latAndLon;

    }


    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeWithStopsId.stopIds.map( (stop,i) => {

          let coordinates = getCoordinatesOfStops(stop);

          let stopPosition = [];
          stopPosition.push(coordinates.latitude);
          stopPosition.push(coordinates.longitude);

          return( 
          <Stop key={i} position={stopPosition}/>
          );

        })}
        
        
      </MapContainer>
    )
      
}

export default Map
