import { Food, FoodSize } from "./Food";

export type Cart = {
  id: number;
  quantity: number;
  food: Food;
  foodSize: FoodSize;
};
