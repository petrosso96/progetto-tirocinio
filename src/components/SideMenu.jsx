import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import {StopsContext} from './StopsContext'



const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 500,
      backgroundColor: theme.palette.background.paper, 
    },
}));



export  default function Sidemenu(props) {
    const classes = useStyles();
    const [routes,setRoutes] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [routeWithStopsId,setRouteWithStopsId,linePredictions,] = useContext(StopsContext);
    const retrieveAllStopsOfRouteAPI = "http://bustime.mta.info/api/where/stops-for-route/";
    const [showLinePredictions,setShowLinePredictions] = useState(false);


    

    useEffect(()=>{

        addRoutes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {

        if(linePredictions.length === 0){

            setShowLinePredictions(false);


        }else{

            setShowLinePredictions(true);


        }
    },[linePredictions]);

    const getStopsFromRoute = (routeId) => {

        
        let StopIdsForRoute = { 
            routeName:"",
            idRoute:"",
            stopIds:[],
            polylines:[],     
        }

        axios.get(retrieveAllStopsOfRouteAPI+routeId+".json?key="+props.apiKey+"&includePolylines=true&version=2")
          .then(response => {        
           
            StopIdsForRoute.polylines = response.data.data.entry.polylines;
            StopIdsForRoute.idRoute = response.data.data.entry.routeId;
            StopIdsForRoute.stopIds = response.data.data.entry.stopIds;


            
        });

    
        return StopIdsForRoute;

    }

    const addRoutes = () =>{

        for(var i=0;i<props.numberOfRoutes;++i){
            let newRouteToShow = {

                id:"",
                name:"",
                description:"",
            }

            newRouteToShow.name = props.routes[i].name;
            newRouteToShow.id = props.routes[i].id;
            newRouteToShow.description = props.routes[i].description;

           setRoutes( routes => [...routes,newRouteToShow]);

        }
    }


    const setRouteToShow = (routeId) => {

       let route = getStopsFromRoute(routeId);

       setRouteWithStopsId(route);

      
    
    }



    
    return ( 
        
          <div className={classes.root}>
              <List component="nav" aria-label="secondary mailbox folders">

                { !showLinePredictions&&(routes.map( (route,i) => {

                        return (  
                            <ListItem   key={i} id={route.id}  button={true}> 
                                <ListItemText onClick={(e) => {setRouteToShow(e.target.parentElement.parentElement.id)}} primary={route.name} secondary={route.description}></ListItemText>
                            </ListItem>
                        );
                    
                        }   
                    ))
                }

                {showLinePredictions&&(linePredictions.map( (prediction,i) => (

                    <ListItem key={i}> 
                        <ListItemText primary={prediction.wait} secondary={prediction.destination+" ("+prediction.line+")"}></ListItemText>
                    </ListItem>
                    )

                  )

                )}
             
              </List>
          </div>
    );

   
    
}
