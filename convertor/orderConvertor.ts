import { Cart } from "@/models/Cart";
import { Order, OrderStatus, PaymentMethod } from "@/models/Order";
import { CartToSend } from "./cartConvertor";
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/models/User";

const CartsToOrder = (
  cartList: Cart[],
  paymentMethod: PaymentMethod,
  user: User
) => {
  const total = cartList.reduce((acc, cart) => {
    return acc + cart.price;
  }, 0);

  const order: Order = {
    id: 0,
    total: total,
    status: OrderStatus.PENDING,
    items: cartList,
    createdAt: new Date(),
    paymentMethod: paymentMethod,
    user: user,
  };
  return order;
};

const OrderToSend = (
  order: Order,
  status: OrderStatus = OrderStatus.PENDING
) => {
  const orderToSend = {
    ...order,
    status: status,
    createAt: order.createdAt.toISOString(),
  };
  return orderToSend;
};

const OrderToReceive = (data: any): Order => {
  const orderReceived: Order = {
    id: data.id,
    total: data.total,
    status: data.status,
    items: data.items,
    createdAt: new Date(data.createdAt),
    paymentMethod: data.paymentMethod,
    user: data.user,
  };
  return orderReceived;
};

export { CartsToOrder, OrderToSend, OrderToReceive };
