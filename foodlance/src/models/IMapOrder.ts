import { IMarker } from "./IMarker";
import ProductInfo from "./ProductInfo";
import { IOrder } from "./IOrder";
import { IUser } from "./IUser";

export interface IMapOrder {
  marker: IMarker;
  products: ProductInfo[];
  order: IOrder;
  sender: IUser;
}