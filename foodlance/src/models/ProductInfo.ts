export default class ProductInfo {

  constructor(id: number) {
    this.Id = id;
  }

  Id: number;
  Name: string = "";
  Quantity: number = 1;
  Price: number = 0;
}