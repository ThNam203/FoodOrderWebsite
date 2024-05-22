import { Food, FoodSize } from "./Food";

export type Cart = {
  id: number;
  quantity: number;
  price: number;
  food: Food;
  foodSize: FoodSize;
  note: string;
};
