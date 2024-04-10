import { Cart } from "@/models/Cart";

const CartToSend = (cart: Cart) => {
  return {
    id: cart.id,
    quantity: cart.quantity,
    food: {
      id: cart.food.id,
    },
    foodSize: {
      id: cart.foodSize.id,
    },
  };
};

const CartToReceive = (data: any): Cart => {
  const cartReceived: Cart = {
    id: data.id,
    quantity: data.quantity,
    food: data.food,
    foodSize: data.foodSize,
  };
  return cartReceived;
};

export { CartToSend, CartToReceive };
