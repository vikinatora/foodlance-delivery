import React, { useEffect, useState, useContext } from 'react';
import { Map, TileLayer, LayerGroup, Marker, Popup, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import "./MapStyles.css";
import { LayerContext } from '../../context/LayerContext';
import MapButtons from '../MapButtons/MapButtons';
import OrderForm from '../OrderForm/OrderForm';
import { Navigation } from '../Navigation/Navigation';

const zoom: number = 15;

export const LeafletMap:React.FC = () => {
  const { point, allMarkers } = useContext(LayerContext);
  const [coordinates, setCoordinate] = useState<LatLngTuple>([0, 0])
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinate([position.coords.latitude, position.coords.longitude]);
    }, () => {
      console.log("Couldn't get location");
    });
  }, [])
   return (
     <>
      <Navigation/>
      <Map id="map" center={coordinates} zoom={zoom}>
        <MapButtons setShowOrderForm={setShowOrderForm} />
        <LayerGroup>
          {point}
          {allMarkers.map((marker: any) => (
            <Marker
              key={marker.orderId}
              position={[marker.lat, marker.lng]}
            >
              <Popup>Popup for Marker</Popup>
              <Tooltip>Tooltip for Marker</Tooltip>
            </Marker>
          ))}
        </LayerGroup>
          <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors">
        </TileLayer>
      </Map>
      <OrderForm showOrderForm={showOrderForm} setShowOrderForm={setShowOrderForm}/>
    </>
   )
}