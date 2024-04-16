import AxiosService from "./axiosService";

const MakePayment = (data: any) => {
  return AxiosService.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    data,
    { headers: { "Content-Type": "application/json", Accept: "*/*" } }
  );
};

const MomoService = {
  MakePayment,
};

export default MomoService;
