import { Cart } from "@/models/Cart";
import { Order, OrderStatus } from "@/models/Order";
import { CartToSend } from "./cartConvertor";

const CartsToOrder = (cartList: Cart[]) => {
  const total = cartList.reduce((acc, cart) => {
    return acc + cart.price;
  }, 0);
  const order: Order = {
    id: 0,
    total: total,
    status: OrderStatus.PENDING,
    items: cartList,
    createdAt: new Date(),
  };
  return order;
};

const OrderToSend = (order: Order, status: OrderStatus) => {
  const orderToSend = {
    ...order,
    status: status,
  };
  return orderToSend;
};

const OrderToReceive = (data: any): Order => {
  const orderReceived: Order = {
    id: data.id,
    total: data.total,
    status: data.status,
    items: data.items,
    createdAt: data.createdAt,
  };
  return orderReceived;
};

export { CartsToOrder, OrderToSend, OrderToReceive };
