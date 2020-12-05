import React,{useEffect, useState, useContext} from 'react';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Timetable from './Timetable';
import useInterval from 'react-useinterval';
import {StopsContext} from './StopsContext';







function StopInfo(props) {

    const REFRESH_INTERVAL = 30000; //expressed in Milliseconds
    const StopMonitoringAPI = "http://bustime.mta.info/api/siri/stop-monitoring.json?key=";
    const ScheduleInformationAPI = "http://bustime.mta.info/api/where/schedule-for-stop/"+props.id+".json?key="+props.API_KEY;
    const CurrentTimeAPI = "http://bustime.mta.info/api/where/current-time.json?key="+props.API_KEY;
    const [infoTable,setInfoTable] = useState([]);
    const [scheduleStopTimes,setScheduleStopTimes] = useState();
    const [keepUpdatingStop,setKeepUpdatingStop] = useState(false);
    const [,,,setLinePredictions] = useContext(StopsContext);
   
    
    useEffect(() => {

        getScheduleInformations();


    },[props.id]);


    useEffect(() => {

        if(keepUpdatingStop){
            
          getRealTimeInformation();
        }


    },[keepUpdatingStop]);


    useInterval(() => {

        setInfoTable([]);
        getRealTimeInformation();

    },keepUpdatingStop ? REFRESH_INTERVAL : null);


    const getScheduleInformations = () => {

        axios.get(ScheduleInformationAPI)
        .then(response => {

            let stopRouteScheduled = response.data.data.entry.stopRouteSchedules;
            
            for (let index = 0; index < stopRouteScheduled.length; index++) {
                const singleRouteScheduled = stopRouteScheduled[index];
                
                if(singleRouteScheduled.routeId === props.routeId){

                    setScheduleStopTimes(singleRouteScheduled.stopRouteDirectionSchedules[0].scheduleStopTimes);
                    break;
                }

            }
        });

    };

    const getWaitTime = (currentTimeInMilliseconds, expectedArrivalTimeInMilliseconds) => {

       let waitTimeinMilliseconds = expectedArrivalTimeInMilliseconds - currentTimeInMilliseconds;
       let waitTime;

           
        if( Math.sign(waitTimeinMilliseconds) === 1){

          let waitTimeInSeconds = waitTimeinMilliseconds/1000;
           
          if(waitTimeInSeconds >= 60){

            let waitTimeInMinutes = waitTimeInSeconds/60;

            waitTime = Math.round(waitTimeInMinutes)+" min.";
            
          }else{

            waitTime = "in arrivo";
            
          }
        }
        else{
            waitTime ="No info available"
        }

        return waitTime;


        
    }

    const cleanTable = () => {

        setKeepUpdatingStop(false);
        setInfoTable([]);
        setLinePredictions([]);


    }


    const getDelay = (currentTimeInMilliseconds,exptectedArrivalTimeInMilliseconds) => {// lavorare in secondi 
            
        if(scheduleStopTimes !== undefined){  
            for (let index = 0; index < scheduleStopTimes.length; index++) {
                const scheduleStopTimeInMilliseconds = scheduleStopTimes[index];

                if(currentTimeInMilliseconds < scheduleStopTimeInMilliseconds.arrivalTime){

                    if(exptectedArrivalTimeInMilliseconds <= scheduleStopTimeInMilliseconds.arrivalTime){
                    
                        return 0;
                    }
                    else{
                        return scheduleStopTimeInMilliseconds.arrivalTime - exptectedArrivalTimeInMilliseconds;
                    }
            
                }
                
            }
        }
        else{
            return "no info available";

        }
       

    }

    const getRealTimeInformation = () => {

        axios.get(CurrentTimeAPI)
        .then(response => {
            
            const currentTimeInMilliseconds = response.data.currentTime;

            axios.get(StopMonitoringAPI+props.API_KEY+"&&MonitoringRef="+props.id+"&&version=2")
            .then(response => {
               

               let MonitoredStopVisit = response.data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
               

                if(MonitoredStopVisit.length > 0){
                
                  

                   for (let index = 0; index < MonitoredStopVisit.length; index++) {
                       const vehicle = MonitoredStopVisit[index];

                       let table = {
                           destination:"",
                           line:"",
                           wait:"",
                           delay:"",
                           
                        }     
  
                        table.destination = vehicle.MonitoredVehicleJourney.DestinationName[0];
                        table.line = vehicle.MonitoredVehicleJourney.PublishedLineName[0];

                        let MonitoredCall = vehicle.MonitoredVehicleJourney.MonitoredCall;
                        if(MonitoredCall.ExpectedArrivalTime !== undefined){

                          let exptecteArrivalTimeInMilliseconds = Date.parse(vehicle.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime);

                          table.delay = getDelay(currentTimeInMilliseconds,exptecteArrivalTimeInMilliseconds);
                          table.wait = getWaitTime(currentTimeInMilliseconds,exptecteArrivalTimeInMilliseconds);
                        

                          setInfoTable(infoTable => [...infoTable,table]); 
                          

                        }
                        else{
                           //in this case there are not ExtimatedTimeArrival
                        }

                    }

                    
                    
                }
                else{
                   //in this case there are not information about current stop

                }
            });

            

        });


    };


    return (
        <Marker position={props.position} >
            <Popup onOpen={() => setKeepUpdatingStop(true)} onClose={() =>cleanTable()}	>
              <Timetable info={infoTable} />
            </Popup>
        </Marker>
    )
}

export default StopInfo