import axios from "axios";

export class NotificationService {
  public static async checkForNotification() {
    try {
      const result = await axios({
        url: "http://localhost:5000/api/notification/check",
        method: "GET",
        headers:{
          "X-Auth-Token": localStorage.getItem("token")
        }
      })
      if(result.data.success) {
        return result.data;
      }
    }
    catch(error) {
      return {
        success: false,
        message: "Unexpected error occured. Please"
      };
    }
  }

  public static async notificationReceived(orderId: string) {
    try {
      const result = await axios({
        url: "http://localhost:5000/api/notification/notificationSent",
        method: "POST",
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

  public static complete(order: any) {
    
  }

  public static showExecutorAcceptedAlert() {
    
  }
}