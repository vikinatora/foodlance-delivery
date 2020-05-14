import React, { useEffect, useState, useContext } from 'react';
import { Map, TileLayer, LayerGroup, Marker, Popup, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import "./MapStyles.css";
import { LayerContext } from '../../context/LayerContext';
import MapButtons from '../MapButtons/MapButtons';
import OrderForm from '../OrderForm/OrderForm';
import { Navigation } from '../Navigation/Navigation';
import { IMapOrder } from '../../models/IMapOrder';
import { OrderInfoPopup } from '../OrderInfoPopup/OrderInfoPopup';

const zoom: number = 15;

export const LeafletMap:React.FC = () => {
  const { point, allOrders } = useContext(LayerContext);
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
          {(allOrders || []).map((order: IMapOrder) => (
            <Marker
              key={order.order.id}
              position={[order.marker.lat, order.marker.lng]}
            >
              <OrderInfoPopup order={order}/>
            <Tooltip>{`Tip: ${order.order.tip}lv. | Total cost: ${order.order.totalPrice}lv.`}</Tooltip>
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