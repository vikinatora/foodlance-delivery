import { IProfile } from "./IProfile";
import { IOrder } from "./IOrder";

export class ProfileModel implements IProfile {
  firstName: string = "";
  lastName: string = "";
  completedOrders: IOrder[] = [];
  experience: number = 0;
  tips: number = 0;
  avatarSrc: string = "";
  
}