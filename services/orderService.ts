import { CartToSend } from "@/convertor/cartConvertor";
import { Cart } from "@/models/Cart";
import AxiosService from "./axiosService";
import { Order, OrderStatus, PaymentMethod } from "@/models/Order";
import { CartsToOrder, OrderToSend } from "@/convertor/orderConvertor";
import { User } from "@/models/User";

const AddOrder = (
  data: Cart[],
  status: OrderStatus,
  paymentMethod: PaymentMethod,
  user: User
) => {
  const orderToSend = OrderToSend(
    CartsToOrder(data, paymentMethod, user),
    status
  );
  return AxiosService.post("/api/orders", orderToSend, {
    withCredentials: true,
  });
};

const GetAllOrders = () => {
  return AxiosService.get("/api/orders", { withCredentials: true });
};

const GetOrder = (id: number) => {
  return AxiosService.get(`/api/orders/${id}`, { withCredentials: true });
};

const UpdateOrder = (id: number, status: OrderStatus) => {
  const statusToSend = { status: status };
  return AxiosService.put(`/api/orders/${id}`, statusToSend, {
    withCredentials: true,
  });
};

const DeleteOrder = (id: number) => {
  return AxiosService.delete(`/api/orders/${id}`, { withCredentials: true });
};

const OrderService = {
  AddOrder,
  GetAllOrders,
  GetOrder,
  DeleteOrder,
  UpdateOrder,
};

export default OrderService;
