import IProductInfo from "./IProductInfo";

export default class ProductInfo implements IProductInfo {

  constructor(id: number) {
    this.id = id;
  }

  id: number;
  name: string = "";
  quantity: number = 1;
  price: number = 0;
}