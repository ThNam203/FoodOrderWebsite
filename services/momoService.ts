import AxiosService from "./axiosService";

const MakePayment = (data: any) => {
  return AxiosService.post(
    "https://test-payment.momo.vn/v2/gateway/api/pos",
    data,
    { withCredentials: true }
  );
};

const MomoService = {
  MakePayment,
};

export default MomoService;
