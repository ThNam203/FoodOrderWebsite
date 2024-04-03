import { Cart } from "@/models/Cart";
import { fakeFoodItems } from "./foodData";

export const fakeCartData: Cart[] = [
  {
    id: 1,
    quantity: 1,
    food: fakeFoodItems[0],
    foodSize: fakeFoodItems[0].foodSizes[0],
  },
];
