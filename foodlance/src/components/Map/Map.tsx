import React, { useEffect, useState, useContext } from 'react';
import { Map, TileLayer, LayerGroup, Marker, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import "./MapStyles.css";
import { LayerContext } from '../../context/LayerContext';
import MapButtons from '../MapButtons/MapButtons';
import OrderForm from '../OrderForm/OrderForm';
import { Navigation } from '../Navigation/Navigation';
import { IMapOrder } from '../../models/IMapOrder';
import { OrderInfoPopup } from '../OrderInfoPopup/OrderInfoPopup';
import { UserService } from '../../services/userService';
import { message, notification } from 'antd';
import { NotificationService } from '../../services/notificationService';
import { OrderCountdown } from '../OrderAlert/OrderCountdown';
import { OrderService } from '../../services/orderService';
import cloneDeep from 'lodash.clonedeep';
import { OrderHelpers } from '../../helpers/OrderHelper';

const zoom: number = 15;

export const LeafletMap:React.FC = () => {
  const { point, allOrders, setAllOrders, setToken } = useContext(LayerContext);
  const [coordinates, setCoordinate] = useState<LatLngTuple>([0, 0]);
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getUserId = async () => {
      const id = await UserService.getUserId();
      setUserId(id);
    };

    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinate([position.coords.latitude, position.coords.longitude]);
      }, () => {
        message.error("Couldn't get location...");
      });
    };
    const getOrders = async () => {
      let clientOrders: IMapOrder[] = [];
      const orders = await OrderService.getOrders();
      orders.forEach((order: any) => {
        clientOrders.push(OrderHelpers.mapDbToClientModel(order));
        setAllOrders(clientOrders);        
      });
    }
    const getToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    }
    getOrders();
    getToken();
    getUserLocation();
    getUserId();
    addNotificationListener()
  }, [])
  
  const showAcceptedOrderAlert = async (listener?: NodeJS.Timeout) => {
    let showedAlert = false;
    const notifications = await NotificationService.checkForNotification();
    if (notifications && notifications.orders && notifications.orders.length) {
      notifications.orders.forEach((order: any) => {
        if (order.requestor === notifications.requestorId) {
          if (listener) {
            clearInterval(listener);
          }
          notification.close("order-alert");
          notification.open({
            duration: 0,
            message: `Your order has been accepted by ${order.executor.firstName} ${order.executor.lastName}`,
            description: <>
              <OrderCountdown
                key={"order-alert"}
                isExecutor={false}
                order={order}
                deliveryMinutes={20}
                onCancelClick={() => cancelOrder(order)}
              />
            </>
          });

          showedAlert =  true;
        }
      });
    }
    return showedAlert;
  }

  const cancelOrder = async (order: IMapOrder) => {
    const response = await OrderService.cancelOrder(order.order.id);
    if (response.success) {
      let clonedOrders: IMapOrder[] = cloneDeep(allOrders);
        const orderIndex = clonedOrders.map(o => o.order.id).indexOf(order.order.id);
        let changedOrder = clonedOrders.filter(o => o.order.id === order.order.id)[0];
        changedOrder.order.inProgress = false;
        changedOrder.order.active = false;
        clonedOrders.splice(orderIndex, 1, changedOrder);
        setAllOrders(clonedOrders);
      notification.close("order-alert");
      message.success({content: "Successfully cancelled the delivery.", duration: 2});
    } else {
      message.error({content: response.message, duration: 2});
    }
  }

  const addNotificationListener = async () => {
    const hasNotification = await showAcceptedOrderAlert();
    if (!hasNotification) {
      const listener = setInterval(async () => {
        await showAcceptedOrderAlert(listener);
      }, 3000)
    }
  }

  
   return (
     <>
      <Navigation/>
      <Map id="map" center={coordinates} zoom={zoom}>
        <MapButtons setShowOrderForm={setShowOrderForm} />
        <LayerGroup>
          {point}
          {allOrders.map((order: IMapOrder) => (
            <Marker
              key={order.order.id}
              position={[order.marker.lat, order.marker.lng]}
            >
            <OrderInfoPopup userId={userId} order={order} cancelOrder={() => cancelOrder(order)}/>
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

