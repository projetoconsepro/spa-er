import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './marker.png';
import CarroLoading from '../components/Carregamento';

const Mapa = ({ address }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`);
        const data = await response.json();
        console.log(data)

        if (data.length > 0) {
          setLatitude(data[0].lat);
          setLongitude(data[0].lon);
        } else {
          setLatitude(null);
          setLongitude(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    geocodeAddress();
  }, [address]);
  
  const customIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [25, 35],
    iconAnchor: [19, 30]
  })

  return (
    <div>
    {latitude !== null && longitude !== null ? (
    <MapContainer center={[latitude, longitude]} zoom={15}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        <Marker position={[latitude, longitude]} icon={customIcon}></Marker>
    </MapContainer>
    ) : <div>
        <CarroLoading />
      </div>
      }
    </div>
  );
};

export default Mapa;
