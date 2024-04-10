import { Food, FoodSize } from "./Food";

export type Order = {
  id: number;
  total: number;
  status: string;
  orderDetails: OrderDetail[];
  createdAt: Date;
};

export type OrderDetail = {
  id: number;
  quantity: number;
  price: number;
  food: Food;
  foodSize: FoodSize;
  createdAt: Date;
};

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
