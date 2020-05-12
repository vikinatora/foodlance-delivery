import React, { useState } from 'react';
import { LatLngTuple } from 'leaflet';
const LayerContext: any = React.createContext({});


  const LayerContextProvider = ({ children }: any) => {
    // TODO: Find a way to pass null
    const [point, setPoint] = useState<LatLngTuple>([0,0]);
    const [token, setToken] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [orderMarkers, setOrderMarkers] = useState<LatLngTuple[]>([]);
    const defaultValue = {
        point,
        setPoint,
        token,
        setToken,
        firstName,
        setFirstName,
        orderMarkers,
        setOrderMarkers
    }


  return (
      <LayerContext.Provider value={defaultValue}>
          {children}
      </LayerContext.Provider>
  )
}

export { LayerContext, LayerContextProvider };
