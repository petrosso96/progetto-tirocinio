import React,{useState, createContext} from 'react';


export const StopsContext = createContext();


export const StopsProvider = (props) => {

    const [routeWithStopsId,setRouteWithStopsId] = useState();
    const [linePredictions,setLinePredictions] = useState([]);


    return(

        <StopsContext.Provider value={[routeWithStopsId,setRouteWithStopsId,linePredictions,setLinePredictions]}>
            {props.children}
        </StopsContext.Provider>
    );



}