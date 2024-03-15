"use client";
import React from "react";
import GoogleMapReact from "google-map-react";

const Marker = ({ lat, lng }: { lat: number; lng: number }) => (
  <div className="bg-primary rounded-lg w-[50px] text-center py-1 text-white">FFOOD</div>
);

export default function CurrentLocationMap() {
  const defaultProps = {
    center: {
      lat: 10.8782497,
      lng: 106.8037157,
    },
    zoom: 11,
  };

  return (
    <div className="h-[500px] w-full p-4">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API_KEY as string }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker lat={10.8782497} lng={106.8037157} />
      </GoogleMapReact>
    </div>
  );
}
