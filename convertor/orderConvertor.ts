import { Cart } from "@/models/Cart";
import { Order, OrderDetail, OrderStatus } from "@/models/Order";

const OrderToSend = (cartList: Cart[], status: OrderStatus) => {
  const orderToSend = {
    total: 0,
    status: status,
    orderDetails: CartsToOrderDetail(cartList),
  };
  return orderToSend;
};

const OrderToReceive = (data: any): Order => {
  const orderReceived: Order = {
    id: data.id,
    total: data.total,
    status: data.status,
    orderDetails: data.orderDetails,
    createdAt: data.createdAt,
  };
  return orderReceived;
};

const CartsToOrderDetail = (cartList: Cart[]) => {
  const orderDetail = cartList.map((cart) => {
    return {
      price: 0,
      quantity: cart.quantity,
      food: {
        id: cart.food.id,
      },
      foodSize: {
        id: cart.foodSize.id,
      },
    };
  });
  return orderDetail;
};

export { OrderToSend, OrderToReceive };
