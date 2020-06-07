import axios from "axios";
import { message } from "antd";
import { IProfile } from "../models/IProfile";
import { ProfileHelpers } from "../helpers/ProfileHelpers";
import { ProfileModel } from "../models/Profile";

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

  public static getProfile = async(): Promise<[IProfile, any[], any[]]> => {
    try {
      const response = await axios.request({
        url: "http://localhost:5000/api/user/profile",
        method: "GET",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
      })
      const requestedOrders: any[] = ProfileHelpers.mapToRequestedOrderInfo(response.data.requestedOrders);
      const completedOrders: any[] = ProfileHelpers.mapToCompletedOrderInfo(response.data.completedOrders);
      const userInfo = ProfileHelpers.mapToUserInfo(response.data.userInfo)
      return [userInfo, requestedOrders, completedOrders];
    }
    catch(error) {
      message.error("Failed to fetch profile info");
      return [new ProfileModel(), [], []];
    }
  }

  public static uploadAvatar = async(avatar: string) => {
    try {
      const response = await axios.request({
        url: "http://localhost:5000/api/user/avatar",
        method: "POST",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
        data: {
          avatar: avatar
        }
      })
      if (response.data.success){
        message.success("Successfully uploaded avatar");
      } else {
        message.error("Couldn't upload avatar.")
      }
    }
    catch(error) {
      message.error("Failed to fetch profile info");
      return [new ProfileModel(), []];
    }
  }
}