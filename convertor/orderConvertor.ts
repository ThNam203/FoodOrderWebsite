import { Cart } from "@/models/Cart";
import { Order, OrderDetail, OrderStatus } from "@/models/Order";

const CartsToOrderForSending = (cartList: Cart[], status: OrderStatus) => {
  const orderToSend = {
    total: 0,
    status: status,
    orderDetails: CartsToOrderDetailForSending(cartList),
  };
  return orderToSend;
};

const UpdateOrderForSending = (order: Order, status: OrderStatus) => {
  const orderToSend = {
    total: order.total,
    status: status,
    orderDetails: order.orderDetails,
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

const CartsToOrderDetailForSending = (cartList: Cart[]) => {
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

// const CartsToOrder = (cart: Cart[]) => {
//   const total = cart.reduce((total, cur) => {
//     return total + cur.quantity * cur.foodSize.price;
//   }, 0);
//   const order: Order = {
//     id: 0,
//      total: total,
//      orderDetails: CartsToOrderDetail(cart),
//   };
//   return order;

// }

export { CartsToOrderForSending, OrderToReceive, UpdateOrderForSending };
