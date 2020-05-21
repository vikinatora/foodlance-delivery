import React, { useState, useEffect } from "react"
import Progress from "antd/lib/progress"
import { Button } from "antd"
import { IMapOrder } from "../../models/IMapOrder";

interface OrderCountdownProps {
  isExecutor: boolean;
  order: IMapOrder;
  deliveryMinutes: number;
  onCancelClick: () => void;
}

export const OrderCountdown: React.FC<OrderCountdownProps> = (props: OrderCountdownProps) => {
  const [minutes, setMinutes] = useState<number>(props.deliveryMinutes);

  const minutesUpdateInterval = setInterval(() => {
    if (minutes > 0 ) {
      setMinutes(minutes - 1)
    } else {
      //TODO: Add logic after countdown is 0
    }
    clearInterval(minutesUpdateInterval);
  }, 60000); 
  

  const extendTime = () => {
    setMinutes(minutes + 5);
  }
  
  return (
    <>
      {
        props.isExecutor
        ? <div>You have {minutes} minutes to complete the order. When you have delivered you goods click the button to complete your part of the order.</div>
        : <div>{props.order.executor?.firstName} has {minutes} minutes to complete the order. When you have received you goods click the button to complete your part of the order.</div>
      }
      <Progress percent={minutes * 5} />
      <Button >Complete delivery</Button>
      {!props.isExecutor
      ? <Button onClick={() => extendTime()} >Extend time</Button>
      : null
      }

      <Button type="danger" onClick={() => props.onCancelClick()}>Cancel delivery</Button>
    </>
  )
}