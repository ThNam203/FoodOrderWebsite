import { CartToSend } from "@/convertor/cartConvertor";
import { Cart } from "@/models/Cart";
import AxiosService from "./axiosService";

const AddCart = (data: Cart) => {
  const cartToSend = CartToSend(data);
  return AxiosService.post("/api/cart", cartToSend, { withCredentials: true });
};

const GetCart = () => {
  return AxiosService.get("/api/cart", { withCredentials: true });
};

const DeleteCart = (id: number) => {
  return AxiosService.delete(`/api/cart/${id}`, { withCredentials: true });
};

const CartService = {
  AddCart,
  GetCart,
  DeleteCart,
};

export default CartService;
