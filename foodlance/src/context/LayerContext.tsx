import React, { useState } from 'react';
import { LatLngTuple } from 'leaflet';
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
  return (
      <LayerContext.Provider value={defaultValue}>
          {children}
      </LayerContext.Provider>
  )
}

export { LayerContext, LayerContextProvider };
