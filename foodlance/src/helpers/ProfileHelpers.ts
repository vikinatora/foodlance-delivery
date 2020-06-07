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
      avatarSrc: info.avatar,
      experience: info.experience,
      firstName: info.firstName,
      lastName: info.lastName,
      tips: +info.tips,
      completedOrders: []
    };

    if (info.completedOrders && info.completedOrders.length) {
      info.completedOrders.forEach((order: any) => {
        mappedInfo.completedOrders.push({
          id: order._id,
          tip: `${order.tip} lv. - ${order.tipPercentage * 100} %`,
          totalPrice: `${order.totalPrice} lv.`,
          requestorName: `${order.requestor.firstName} ${order.requestor.lastName}`,
          completedDate: ProfileHelpers.mapToNormalDate(order.completedDate)
        })
      });
    }
    console.log(mappedInfo);
    return mappedInfo;
  }

  public static mapToOrderInfo = (orders: any): any[] => {
    const mappedOrders: any[] = [];

    if (orders && orders.length) {
      orders.forEach((order: any) => {
        const newOrder = {
          id: order._id,
          totalPrice: `${order.totalPrice} lv.`,
          tip: `${order.tip} lv. - ${order.tipPercentage * 100} %`,
          inProgress: order.inProgress,
          completed: order.completed,
          active: order.active,
          reactivated: order.reactivated,
          createdDate: ProfileHelpers.mapToNormalDate(order.createdDate),
          products: ProfileHelpers.mapToProducts(order.products)
        };
        mappedOrders.push(newOrder)
      });
    }
    return mappedOrders;
  }

  public static mapToProducts = (products: any[]) => {
    const newProducts: any[] = [];

    if (products && products.length) {
      products.forEach((product: any) => {
        const newProduct = {
          name: product.name,
          price: `${product.price} lv.`,
          quantity: product.quantity
        }
        newProducts.push(newProduct);
      });
    }

    return newProducts;
    
  }

  public static mapToNormalDate = (date: string): string => {
    const splitDate = date.split(/[T\\.]/);
    const yearMonthDate = splitDate[0].split("-");
    const formatedDate = `${yearMonthDate[2]}/${yearMonthDate[1]}/${yearMonthDate[0]}`
    const formatedTime = splitDate[1].substr(0, splitDate[1].lastIndexOf(":"));
    const formated = `${formatedDate} ${formatedTime}`;

    return formated;
  }
}