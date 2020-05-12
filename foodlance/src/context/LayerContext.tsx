import React, { useState, useEffect } from 'react';
import { LatLngTuple, marker } from 'leaflet';
import axios from "axios";
import { IMarker } from '../models/IMarker';
const LayerContext: any = React.createContext({});


  const LayerContextProvider = ({ children }: any) => {
    // TODO: Find a way to pass null
    const [point, setPoint] = useState<LatLngTuple>([0,0]);
    const [token, setToken] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [orderMarkers, setOrderMarkers] = useState<LatLngTuple[]>([]);
    const [allMarkers, setAllMarkers] = useState<IMarker[]>([])
    const defaultValue = {
        point,
        setPoint,
        token,
        setToken,
        firstName,
        setFirstName,
        orderMarkers,
        setOrderMarkers,
        allMarkers,
        setAllMarkers
    }

    useEffect(() => {
      const getMarkers = async () => {
        let markers: IMarker[] = [];
        await axios({
          url: "http://localhost:5000/api/marker/getAll",
          method: "GET"
        }).then((response) => {
          markers = response.data;
          setAllMarkers(markers)        
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
