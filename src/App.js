import './App.css';
import Map from './components/Map.jsx'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import SideMenu from './components/SideMenu.jsx'
import {StopsProvider} from './components/StopsContext'





function App() {

  const API_KEY = "12eaff53-dc07-4730-a2bb-bd5478ee8822";
  const numberOfRoutesToShow = 10;
  const retrieveAllRoutesCoveredAPI = " http://bustime.mta.info/api/where/routes-for-agency/MTA%20NYCT.json?key="+API_KEY;
  const [routes,setRoutes] = useState([]);
  const [loadingListOfRoutes,setLoadingListOfRoutes] = useState(true);




  useEffect( () =>{

    getRoutesCoveredFromAgency();

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {

    if(routes.length === numberOfRoutesToShow){
      setLoadingListOfRoutes(false)
    }
    

  },[routes])

  const getRoutesCoveredFromAgency = () => {


    axios.get(retrieveAllRoutesCoveredAPI)
    .then( response => {

      for(var i=0; i< response.data.data.list.length;++i){

        let singleRoute = {

          id:"",
          name:"",
          description:"",
        }

        singleRoute.id =  response.data.data.list[i].id;
        singleRoute.name = response.data.data.list[i].longName;
        singleRoute.description = response.data.data.list[i].description;


        setRoutes( routes => [...routes,singleRoute]  );
       

      }

   
    
    });

  }






  if(routes.length >= numberOfRoutesToShow  ){
    
   
    return (
      <StopsProvider>
        <div>

          <Map  apiKey={API_KEY} />
          {!loadingListOfRoutes&&(<SideMenu apiKey={API_KEY} routes={routes} numberOfRoutes={numberOfRoutesToShow}/>)}
  
        </div>
      </StopsProvider>
    );

    
  }
  else{
    return (<div className="circular-progress"> <CircularProgress /></div>);
  }
}

export default App;
