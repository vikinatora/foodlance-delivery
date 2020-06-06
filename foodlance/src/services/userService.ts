import axios from "axios";
import { message } from "antd";
import { IProfile } from "../models/IProfile";
import { ProfileHelpers } from "../helpers/ProfileHelpers";
import { ProfileModel } from "../models/Profile";
import { IOrder } from "../models/IOrder";

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

  public static getProfile = async(): Promise<[IProfile, any[]]> => {
    try {
      const response = await axios.request({
        url: "http://localhost:5000/api/user/profile",
        method: "GET",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
      })
      const userOrders: any[] = ProfileHelpers.mapToOrderInfo(response.data.userOrders);
      const userInfo = ProfileHelpers.mapToUserInfo(response.data.userInfo)
      return [userInfo, userOrders];
    }
    catch(error) {
      message.error("Failed to fetch profile info");
      return [new ProfileModel(), []];
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