import React, { useState, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import axios from "axios";
import { IMarker } from '../models/IMarker';
import { IMapOrder } from '../models/IMapOrder';
import { OrderHelpers } from '../helpers/OrderHelper';
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
        let clientOrders: IMapOrder[] = [];
        await axios({
          url: "http://localhost:5000/api/order/getAll",
          method: "GET"
        }).then((response) => {
          response.data.forEach((order: any) => {
            clientOrders.push(OrderHelpers.mapDbToClientModel(order));
            setAllOrders(clientOrders);        
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
