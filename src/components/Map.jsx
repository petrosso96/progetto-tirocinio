import React from 'react'
import {MapContainer, Popup, Marker, TileLayer} from 'react-leaflet';




function Map(props) {
    const position = [40.7127281,-74.0060152];
    
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}><Popup></Popup></Marker>
        
        
      </MapContainer>
    )
}

export default Map
