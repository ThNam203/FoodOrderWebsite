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

const CartService = {
  AddCart,
  GetCart,
};

export default CartService;
