import React, { useState, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import axios from "axios";
import { IMarker } from '../models/IMarker';
import { IMapOrder } from '../models/IMapOrder';
const LayerContext: any = React.createContext({});


  const LayerContextProvider = ({ children }: any) => {
    // TODO: Find a way to pass null
    const [point, setPoint] = useState<LatLngTuple>([0,0]);
    const [token, setToken] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [allOrders, setAllOrders] = useState<IMapOrder[]>([])
    const defaultValue = {
        point,
        setPoint,
        token,
        setToken,
        firstName,
        setFirstName,
        setAllOrders,
        allOrders
    }

    useEffect(() => {
      const getMarkers = async () => {
        let clientOrder: IMapOrder[] = [];
        await axios({
          url: "http://localhost:5000/api/order/getAll",
          method: "GET"
        }).then((response) => {
          response.data.forEach((order: any) => {
            clientOrder.push({
              order: {
                totalPrice: order.totalPrice,
                tip: order.tip,
                tipPercentage: order.tipPercentage,
                id: order._id
              },
              sender: {
                firstName: order.sender.firstName,
                id: order.sender._id,
                lastName: order.sender.lastName
              },
              marker: {
                lat: order.marker.lat,
                lng: order.marker.lng
              },
              products: order.products.length 
              ? order.products.map((p: any) => {
                return { 
                  name: p.name, 
                  price: p.price, 
                  quantity: p.quantity
                }
              })
              : null,
            })
            setAllOrders(clientOrder);        
          });
        });
      }
      const getToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          setToken(token);
        }
      }
      getMarkers();
      getToken();
    }, [])
  return (
      <LayerContext.Provider value={defaultValue}>
          {children}
      </LayerContext.Provider>
  )
}

export { LayerContext, LayerContextProvider };
