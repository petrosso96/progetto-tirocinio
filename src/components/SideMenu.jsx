import React from 'react'

export function Sidemenu(props) {
    
    

    return ( 
        
        <div>
            <ol>
        {props.routesAndStops.map( (route,i) => {

            return( <li key={i}>{route.name}</li> );
        } ) }
            </ol>
        </div>
    )
}
