import { Cart } from "./Cart";
import { Food, FoodSize } from "./Food";

export type Order = {
  id: number;
  total: number;
  status: OrderStatus;
  items: Cart[];
  createdAt: Date;
};

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
