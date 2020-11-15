import './App.css';
import Map from './components/Map.jsx'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';




function App() {

  const API_KEY = "12eaff53-dc07-4730-a2bb-bd5478ee8822";
  
  const retrieveAllStopsOfRouteAPI = "http://bustime.mta.info/api/where/stops-for-route/"
  const retrieveAllRoutesCoveredAPI = " http://bustime.mta.info/api/where/routes-for-agency/MTA%20NYCT.json?key="+API_KEY;
  const [routes,setRoutes] = useState();
  const [stopsFromRoutes, setStopFromRoutes] = useState([]);



  useEffect( () =>{

    if(routes === undefined){
  
      axios.get(retrieveAllRoutesCoveredAPI)
      .then( response => {

        setRoutes(response.data.data.list);
        console.log(response.data.data.list)
        
        
      
      });

    }
    else{ 
    
      var singleRoute;
      let routeWithStops = {
        idRoute:"",
        name:"",
        stopIds:[],
        polylines:[],

      }

      for(singleRoute of routes){

        routeWithStops.name = singleRoute.longName;
        
        axios.get(retrieveAllStopsOfRouteAPI+singleRoute.id+".json?key="+API_KEY+"&includePolylines=true&version=2")
        .then(response => {

          routeWithStops.polylines = response.data.data.entry.polylines;
          routeWithStops.stopIds = response.data.data.entry.stopIds;
          routeWithStops.idRoute = response.data.data.entry.routeId;

          setStopFromRoutes( oldArray => [...oldArray,routeWithStops] );
        
        })
        
      }

    }
    
  },[routes,retrieveAllRoutesCoveredAPI]);



  if(routes !== undefined){
   
    return (
      <div>
   
      <Map />
      </div>
    );

    
  }
  else{
    return (<div className="circular-progress"> <CircularProgress /></div>);
  }
}

export default App;
