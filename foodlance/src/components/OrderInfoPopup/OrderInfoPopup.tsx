import { Popup } from "react-leaflet"
import React, { useState } from "react"
import ProductInfo from "../../models/ProductInfo"
import { IMapOrder } from "../../models/IMapOrder"
import { Button, message } from "antd"
import { OrderService } from "../../services/orderService"

interface OrderInfoPopupProps {
  order: IMapOrder;
  userId: string;
}

export const OrderInfoPopup: React.FC<OrderInfoPopupProps> = (props: OrderInfoPopupProps) => {
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const [isCanceling, setIsCanceling] = useState<boolean>(false);

  const acceptOrder = async() => {
    setIsInProgress(true);
    if (props.userId !== props.order.requestor.id) {
      const response = await OrderService.acceptOrder(props.order.order.id, props.userId);
      if (response.success) {
        message.success({content: "Successfully accepted order. Now deliver it 😊", duration: 2});
        // TODO: Notify requestor 
      } else {
        message.error({content: response.message, duration: 2});

      }
    }
  }
  const cancelOrder = async() => {
    setIsInProgress(false);
    setIsCanceling(true);
    message.info({content: "Canceling your order...", duration: 1})
    // TODO: Set active to false in db
    const response = await OrderService.cancelOrder(props.order.order.id, props.userId);
    if (response.success) {
      message.success({content: "Successfully cancelled the order.", duration: 2});
    } else {
      message.error({content: response.message, duration: 2});
    }
    setIsCanceling(false);
  }
  if (!props.userId) {
    return (
      <Popup>
        <div><span>You have to log in before viewing orders.</span></div>
      </Popup>
    )
  } else {
    return (
      <Popup>
        <div className="order-details">
          <div><span>Products wanted by {props.order.requestor.firstName} {props.order.requestor.lastName}</span></div>
          <ol>
          {(props.order.products || []).map((product: ProductInfo) => (
            <li>{product.name} - Qty: {product.quantity} - Price: {product.price}</li>
          ))}
          </ol>
          <div><span>Total price: {props.order.order.totalPrice}</span></div>
          <div className="button-section">
            {
              props.userId === props.order.requestor.id 
              ? null
              : <Button
               loading={isInProgress || props.order.order.inProgress}
               onClick={() => acceptOrder()}
               >
                 { isInProgress || props.order.order.inProgress ? "Order in progress" : "Accept order" }
               </Button>
            }
            {
              isInProgress || props.order.order.inProgress || props.userId === props.order.requestor.id
              ? <Button type="danger" loading={isCanceling} onClick={() => cancelOrder()}>Cancel order</Button>
              : null
            }
          </div>
        </div>
      </Popup>
    )
  }
}