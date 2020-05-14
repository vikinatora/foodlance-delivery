export interface IOrder {
  id: string;
  totalPrice: number;
  tip: number;
  tipPercentage: number;
  active: boolean,
  inProgress: boolean,
  completed: boolean
}