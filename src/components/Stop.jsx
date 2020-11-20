import React,{useEffect, useState} from 'react';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Timetable from './Timetable';
import useInterval from 'react-useinterval';





function StopInfo(props) {

    const REFRESH_INTERVAL = 10000;
    const StopMonitoringAPI = "http://bustime.mta.info/api/siri/stop-monitoring.json?key=";
    const ScheduleInformationAPI = "http://bustime.mta.info/api/where/schedule-for-stop/"+props.id+".json?key="+props.API_KEY;
    const CurrentTimeAPI = "http://bustime.mta.info/api/where/current-time.json?key="+props.API_KEY;
    const [infoTable,setInfoTable] = useState([]);
    const [scheduleStopTimes,setScheduleStopTimes] = useState();
    const [keepUpdatingStop,setKeepUpdatingStop] = useState(false);
    
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

    const setWaitTime = (table, expectedArrivalTime) => {

        axios.get(CurrentTimeAPI)
        .then(response => {

           let expectedArrivalTimeInMilliseconds = Date.parse(expectedArrivalTime);
           let currentTimeInMilliseconds = response.data.currentTime;
           let waitTimeinMilliseconds = expectedArrivalTimeInMilliseconds - currentTimeInMilliseconds;
           

           if( Math.sign(waitTimeinMilliseconds) === 1){

              let waitTimeInSeconds = waitTimeinMilliseconds/1000;
           
              if(waitTimeInSeconds >= 60){

                let waitTimeInMinutes = waitTimeInSeconds/60;

                table.wait = Math.round(waitTimeInMinutes)+" min.";
            
              }else{

                table.wait = "in arrivo";
            
              }
            }
            else{
                table.wait ="No info available"
            }

            setInfoTable(infoTable => [...infoTable,table]);

        })

    }

    const cleanTable = () => {

        setKeepUpdatingStop(false);
        setInfoTable([]);

    }

    const getRealTimeInformation = () => {

        axios.get(StopMonitoringAPI+props.API_KEY+"&&MonitoringRef="+props.id+"&&version=2")
        .then(response => {

            let vehiclesServingStop = response.data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;

            if(vehiclesServingStop.length > 0){
                

                for (let index = 0; index < vehiclesServingStop.length; index++) {
                    const vehicle = vehiclesServingStop[index];

                    
                    let table = {
                        destination:"",
                        line:"",
                        wait:""
                    }     

                    //console.log(vehiclesServingStop[0].MonitoredVehicleJourney)
                    table.destination = vehicle.MonitoredVehicleJourney.DestinationName[0];
                    table.line = vehicle.MonitoredVehicleJourney.PublishedLineName[0];

                    let MonitoredCall = vehicle.MonitoredVehicleJourney.MonitoredCall;
                    if(MonitoredCall.ExpectedArrivalTime !== undefined){

        
                    //console.log(vehiclesServingStop[0].MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime)
                    setWaitTime(table,vehicle.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime);


                    }
                    else{
                        //in this case there are not ExtimatedTimeArrival
                    }
                }
                    
            }
            else{
                //in this case there are not information about current stop

            }

            

        })


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