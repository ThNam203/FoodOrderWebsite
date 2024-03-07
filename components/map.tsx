import React from "react";
import GoogleMapReact from 'google-map-react';

export default function CurrentLocationMap(){
    const defaultProps = {
      center: {
        lat: 10.8782497,
        lng: 106.8037157
      },
      zoom: 10
    };
  
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }