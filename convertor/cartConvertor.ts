import { Cart } from "@/models/Cart";

const CartToSend = (cart: Cart) => {
  return {
    id: cart.id,
    food: {
      id: cart.foodId,
    },
    foodSize: {
      id: cart.foodSizeId,
    },
  };
};

const CartToReceive = (data: any): Cart => {
  const cartReceived: Cart = {
    id: data.id,
    quantity: data.quantity,
    foodId: data.food.id,
    foodSizeId: data.foodSize.id,
  };
  return cartReceived;
};

export { CartToSend, CartToReceive };
