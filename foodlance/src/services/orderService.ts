import axios from "axios";

export class OrderService {
  public static async acceptOrder(orderId: string, userId: string) {
    try {
      const result = await axios({
        url: "http://localhost:5000/api/order/accept",
        method: "POST",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
        data: {
          orderId: orderId,
          userId: userId
        }
      })
      return result.data;
    }
    catch(error) {
      return {
        success: false,
        message: "Unexpected error occured"
      };
    }
  }
  public static async cancelOrder(orderId: string) {
    try {
      const result = await axios({
        url: "http://localhost:5000/api/order/cancel",
        method: "POST",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
        data: {
          orderId: orderId
        }
      })
      return result.data;
    }
    catch(error) {
      return {
        success: false,
        message: "Unexpected error occured. Please"
      };
    }
  }

  public static async removeOrder(orderId: string) {
    try {
      const result = await axios({
        url: "http://localhost:5000/api/order/remove",
        method: "POST",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
        data: {
          orderId: orderId
        }
      })
      return result.data;
    }
    catch(error) {
      return {
        success: false,
        message: "Unexpected error occured. Please"
      };
    }
  }
}