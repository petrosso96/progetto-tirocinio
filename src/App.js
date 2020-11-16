import './App.css';
import Map from './components/Map.jsx'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Sidemenu } from './components/SideMenu';




function App() {

  const API_KEY = "12eaff53-dc07-4730-a2bb-bd5478ee8822";
  const numberOfRoutesToRetrieve = 4;
  const retrieveAllStopsOfRouteAPI = "http://bustime.mta.info/api/where/stops-for-route/"
  const retrieveAllRoutesCoveredAPI = " http://bustime.mta.info/api/where/routes-for-agency/MTA%20NYCT.json?key="+API_KEY;
  const [routes,setRoutes] = useState();
  const [stopsFromRoutes, setStopFromRoutes] = useState([]);
  const [idOfAllStops,setIdOfAllStops] = useState([]);


  useEffect( () =>{

    if(routes === undefined){
  
      axios.get(retrieveAllRoutesCoveredAPI)
      .then( response => {

        setRoutes(response.data.data.list);
      
      });

    }
    else{ 

      setStopFromRoutes( getStopsFromRoute() );
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[routes, retrieveAllRoutesCoveredAPI]);


  const getStopsFromRoute = () =>{

    
    let routesToReturn = [];

    for(var i=0;i<numberOfRoutesToRetrieve;i++){

      let newRouteWithStops = { // important to declare inside the loop
        idRoute:"",
        name:"",
        stopIds:"",
        polylines:"",
  
      }

     
      newRouteWithStops.name = routes[i].longName;

      axios.get(retrieveAllStopsOfRouteAPI+routes[i].id+".json?key="+API_KEY+"&includePolylines=true&version=2")
      .then(response => {        
        
        newRouteWithStops.polylines = response.data.data.entry.polylines;
        newRouteWithStops.idRoute = response.data.data.entry.routeId;
        newRouteWithStops.stopIds = response.data.data.entry.stopIds;
        
        
        routesToReturn.push(newRouteWithStops) ;
        setIdOfAllStops( idOfAllStops => [...idOfAllStops,newRouteWithStops.stopIds]);

      })

    }
    return routesToReturn;
  }





  




  if(routes !== undefined && stopsFromRoutes !== undefined && idOfAllStops !== undefined){
    
   
    return (
      <div>
      <Sidemenu routesAndStops={stopsFromRoutes}/>

      <Map stopsMatrix={idOfAllStops} apiKey={API_KEY} />
      </div>
    );

    
  }
  else{
    return (<div className="circular-progress"> <CircularProgress /></div>);
  }
}

export default App;
