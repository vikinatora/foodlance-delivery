import { Popup } from "react-leaflet"
import React, { useState } from "react"
import ProductInfo from "../../models/ProductInfo"
import { IMapOrder } from "../../models/IMapOrder"
import { Button } from "antd"

interface OrderInfoPopupProps {
  order: IMapOrder;
}

export const OrderInfoPopup: React.FC<OrderInfoPopupProps> = (props: OrderInfoPopupProps) => {
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const acceptOrder = () => {
    setIsInProgress(true);
  }
  const cancelOrder = () => {
    setIsInProgress(false);
  }
  return (
    <Popup>
      <div className="order-details">
        <div><span>Products wanted by {props.order.sender.firstName} {props.order.sender.lastName}</span></div>
        <ol>
        {props.order.products.map((product: ProductInfo) => (
          <li>{product.name} - Qty: {product.quantity} - Price: {product.price}</li>
        ))}
        </ol>
        <div><span>Total price: {props.order.order.totalPrice}</span></div>
        <div className="button-section">
          <Button loading={isInProgress} onClick={() => acceptOrder()}>Accept order</Button>
          {
            isInProgress
            ? <Button type="danger" onClick={() => cancelOrder()}>Cancel order</Button>
            : null
          }
        </div>
      </div>
    </Popup>
  )
}