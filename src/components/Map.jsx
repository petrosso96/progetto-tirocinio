import React,{ useState, useEffect,useContext } from 'react'
import {MapContainer, TileLayer} from 'react-leaflet';
import axios from 'axios';
import {StopsContext} from './StopsContext'
import Stop from './Stop'
import { Polyline } from 'react-leaflet';



function Map(props) {
    const [position,] = useState([40.7127281,-74.0060152]);
    const [routeWithStopsId,] = useContext(StopsContext);
    const [loadingStopsToRender,setLoadingStopsToRender] = useState(true);
    const [stopsCoordinatesToRender,setStopsCoordinatesToRender] = useState([]);
    const [polylinesCoordinates,setPolylinesCoordinates] = useState([]);
    const retrieveStopPositionAPI = "http://bustime.mta.info/api/where/stop/";

    const decodePolyline = (encoded) => {

      var len = encoded.length,
  		index = 0,
  		array = [],
  		lat = 0,
  		lng = 0;

      while (index < len) {
        var b,
        shift = 0,
    	  result = 0;
    
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        }while (b >= 0x20);

        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;

        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);

        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        array.push([lat * 1e-5, lng * 1e-5]);
      }

      return array;
    }

   
 
    const getCoordinatesOfPolylines = (polylines) =>{

      for (let index = 0; index < polylines.length; index++) {
        const element = polylines[index];

      
        let decodedPolylineArray = decodePolyline(element.points);

        setPolylinesCoordinates(polylinesCoordinates => [...polylinesCoordinates,decodedPolylineArray]);
        
      }
    }

    const getCoordinatesOfStops = (stopIds) => {

      

      for(var i = 0;i < stopIds.length;++i){

        let latLonAndId = ["","",""]

        axios.get(retrieveStopPositionAPI+stopIds[i]+".json?key="+props.apiKey+"&&version=2")
        .then(response => {
          

  
          latLonAndId[0] = parseFloat(response.data.data.entry.lat);
          latLonAndId[1] = parseFloat(response.data.data.entry.lon);
          latLonAndId[2] = response.data.data.entry.id ;


          setStopsCoordinatesToRender(stopsCoordinatesToRender => [...stopsCoordinatesToRender,latLonAndId]);
        });
      }

      
    }



    useEffect(() => {

      
      if(routeWithStopsId !== undefined){

        if(stopsCoordinatesToRender.length !== 0){//reset the number of stops to print

          setStopsCoordinatesToRender([]);

        }
        if(polylinesCoordinates.length !== 0){//reset the number of lines to print

          setPolylinesCoordinates([]);

        }

        setTimeout(() =>  {

          setLoadingStopsToRender(false);
          getCoordinatesOfStops(routeWithStopsId.stopIds);
          getCoordinatesOfPolylines(routeWithStopsId.polylines);

        },600);
      }

    },[routeWithStopsId]);

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!loadingStopsToRender&&(stopsCoordinatesToRender.map( (stop,i) => {
   
          let stopPosition = [];
          stopPosition.push(stop[0]);
          stopPosition.push(stop[1]);

          return( 
            <Stop key={i} position={stopPosition} id={stop[2]} API_KEY={props.apiKey} routeId={routeWithStopsId.idRoute}/>
          );

        }))}

                
        <Polyline positions={polylinesCoordinates}></Polyline>
      
      </MapContainer>
    )
      
}

export default Map
