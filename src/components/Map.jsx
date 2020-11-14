import React from 'react'
import {MapContainer, Popup, Marker, TileLayer} from 'react-leaflet';
import Bus from './Bus';



function Map() {
    const position = [40.7127281,-74.0060152];
    return (
        <MapContainer center={[40.7127281, -74.0060152]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>
                <Bus/>

            </Popup>
        </Marker>
        
      </MapContainer>
    )
}

export default Map
