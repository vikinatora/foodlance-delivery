import React, { useContext } from 'react';
import useAddMarker from '../Map/hooks/useAddMarker';
import { LayerContext } from '../../context/LayerContext';
import { message } from 'antd';

interface MapButtonProps {
  setShowOrderForm: React.Dispatch<React.SetStateAction<boolean>>
}

const MapButtons: React.FC<MapButtonProps> = (props: MapButtonProps) => {
    const { activate, setActivate } = useAddMarker(false);
    const { token, point } = useContext(LayerContext);
    
    return (
      <>
      <button disabled={!token && !localStorage.getItem("token")} className="addButton" onClick={() => {
        if (token && localStorage.getItem("token")) {
          setActivate(true);
        } else {
          message.info({content: "You need to login before making an order.", duration: 2});
        }
      } }
      >{!activate ? "New delivery point" : "Cancel new delivery"}</button>
      { 
        activate && point && token
        ? <button className="confirmButton" onClick={() => props.setShowOrderForm(true)}>Confirm place of order</button>
        : null
      }
      </>
      );
}

export default MapButtons;
