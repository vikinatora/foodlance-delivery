import axios from "axios";
import { message } from "antd";

export class UserService {
  public static getUserId = async(): Promise<string> => {
    try {
      const response = await axios.request<string>({
        url: "http://localhost:5000/api/user/getId",
        method: "GET",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
      })
      return response.data;
    }
    catch(error) {
      return "";
    }
  }

  public static getProfile = async() => {
    try {
      const response = await axios.request<string>({
        url: "http://localhost:5000/api/user/profile",
        method: "GET",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
      })
      return response.data;
    }
    catch(error) {
      message.error("Failed to fetch profile info");
      return {
        success: false
      }
    }
  }


}