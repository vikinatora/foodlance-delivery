import { message } from "antd";
import { RcFile } from "antd/lib/upload";
import { IProfile } from "../models/IProfile";

export class ProfileHelpers {
  public static getBase64 = (img: any, callback : Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  public static beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  
  public static mapToUserInfo = (info: any): IProfile => {
    const mappedInfo: IProfile = {
      avatarSrc: info.avatarSrc,
      experience: info.experience,
      firstName: info.firstName,
      lastName: info.lastName,
      tips: +info.tips,
      completedOrders: []
    };

    if (info.completedOrders && info.completedOrders.length) {
      info.completedOrders.forEach((order: any) => {
        mappedInfo.completedOrders.push({
          tip: `${order.tip} lv.`,
          tipPercentage: `${order.tipPercentage * 100} %`,
          totalPrice: `${order.totalPrice} lv.`,
          requestorName: `${order.requestor.firstName} ${order.requestor.lastName}`
        })
      });
    }
    console.log(mappedInfo);
    return mappedInfo;
  }
}