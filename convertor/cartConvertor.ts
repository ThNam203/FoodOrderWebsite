import { Cart } from "@/models/Cart";

const CartToSend = (cart: Cart) => {
  return {
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
    price: data.price,
    food: data.food,
    foodSize: data.foodSize,
  };
  return cartReceived;
};

export { CartToSend, CartToReceive };
