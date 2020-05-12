import ProductInfo from "./ProductInfo"

export default class Order {
  private id: number = 1;
  public products: ProductInfo[] = [ new ProductInfo(this.id) ];
  public totalPrice: number = 0;
  public productsPrice: number = 0;
  public tip: number = 0;
  public tipPercentage: number | string = 0.15;

  public addNewProduct ()  {
    this.id++;
    this.products.push(new ProductInfo(this.id));
    return this.products;
  }
}