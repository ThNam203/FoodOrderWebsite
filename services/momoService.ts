import { CartToSend } from "@/convertor/cartConvertor";
import { Cart } from "@/models/Cart";
import AxiosService from "./axiosService";

const MakePayment = (data: any) => {
  const paymentData = {};
  return AxiosService.post(
    "https://test-payment.momo.vn/v2/gateway/api/pos",
    paymentData,
    { withCredentials: true }
  );
};

const MomoService = {};

export default MomoService;
