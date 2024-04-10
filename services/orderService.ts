import { CartToSend } from "@/convertor/cartConvertor";
import { Cart } from "@/models/Cart";
import AxiosService from "./axiosService";
import { Order, OrderStatus } from "@/models/Order";
import {
  CartsToOrderForSending,
  UpdateOrderForSending,
} from "@/convertor/orderConvertor";

const AddOrder = (data: Cart[], status: OrderStatus) => {
  const orderToSend = CartsToOrderForSending(data, status);
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

const UpdateOrder = (id: number, data: Order, status: OrderStatus) => {
  const orderToSend = UpdateOrderForSending(data, status);
  return AxiosService.put(`/api/orders/${id}`, orderToSend, {
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
