import { useState, useEffect } from "react";
import { NotificationService } from "../../services/notificationService";
import { notification, Progress, Button } from "antd";
import React from "react";
import cloneDeep from "lodash.clonedeep";

export const OrderAlert: React.FC = () => {
  const [deliveryMinutes, setDeliveryMinutes] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [listen, setListen] = useState<boolean>(false);

  const increaseMinutes = () => {
    console.log(deliveryMinutes);
    const minutes = deliveryMinutes + 1;
    console.log(minutes);
    setDeliveryMinutes(minutes);
  }
  useEffect(() => {
    addNotificationListener();
  }, []);
  
  const addNotificationListener = () => {
    const listener = setInterval(async () => {
      const notifications = await NotificationService.checkForNotification();
      if (notifications.orders.length) {
        notifications.orders.forEach((order: any) => {
          if (order.requestor === notifications.requestorId) {
            const timer = setInterval(increaseMinutes, 1000)
            notification.open({
              duration: 0,
              message: `Your order has been accepted by ${order.executor.firstName} ${order.executor.lastName}`,
              description: `<>
              <div>{order.executor.firstName} has 20 minutes to complete the order. When you have received you goods click the button to complete the order</div>
              <Progress percent={deliveryMinutes} />
              <Button >Complete delivery</Button>
              <Button type="danger" >Cancel delivery</Button>
              </>`
              
            })
            clearInterval(listener);
          }
        });
      }
    }, 3000)
  }
  return (
    null
  )
}