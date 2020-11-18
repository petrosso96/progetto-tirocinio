import React,{useState, createContext} from 'react';


export const StopsContext = createContext();


export const StopsProvider = (props) => {

    const [routeWithStopsId,setRouteWithStopsId] = useState([{

        stopIds:[]
    }]);


    return(

        <StopsContext.Provider value={[routeWithStopsId,setRouteWithStopsId]}>
            {props.children}
        </StopsContext.Provider>
    );



}