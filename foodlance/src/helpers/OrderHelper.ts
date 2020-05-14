import { IMapOrder } from "../models/IMapOrder";

export class OrderHelpers {
  public static mapDbToClientModel(order: any): IMapOrder {
    return {
      order: {
        totalPrice: order.totalPrice,
        tip: order.tip,
        tipPercentage: order.tipPercentage,
        id: order._id,
        active: order.active,
        inProgress: order.inProgress,
        completed: order.completed
      },
      requestor: {
        firstName: order.requestor.firstName,
        id: order.requestor._id,
        lastName: order.requestor.lastName
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
    }
  }
}