import React, { useState, useEffect } from 'react';
import axios from "axios";

function Bus() {

    const API = "https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=12eaff53-dc07-4730-a2bb-bd5478ee8822&version=2&VehicleMonitoringDetailLevel=minimum";
    const [roba,setROba] = useState("");

    useEffect(() => {

        axios.get(API,{
            headers:{
                'Content-Type':'application/json',
                

            }
        })
        .then(res => {
            console.log("CIAO")
            console.log(res.headers.server);
            setROba(res.headers.server);
        })
    },[]);


    if(roba !== ''){
        return (
            <div>
                {roba}
            </div>
        )
        }
        else{
    
            return (<div> niente</div>)
        }
}

export default Bus
