import { Cart } from "./Cart";
import { Food, FoodSize } from "./Food";
import { User } from "./User";

export type Order = {
  id: number;
  total: number;
  status: OrderStatus;
  items: Cart[];
  createdAt: Date;
  paymentMethod: PaymentMethod;
  user: User;
};

export enum PaymentMethod {
  CASH = "Pay by cash",
  MOMO = "Pay with Momo wallet",
}

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
