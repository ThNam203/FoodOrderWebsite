import * as crypto from "crypto";

const CreateDataForPayment = (data: any) => {
  return {
    partnerCode: "MOMO",
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestType: "captureWallet",
    ipnUrl: "https://momo.vn",
    redirectUrl: "https://momo.vn",
    orderId: "MM1540456472575",
    amount: 150000,
    lang: "vi",
    orderInfo: "SDK team.",
    requestId: "MM1540456472575",
    extraData: "eyJ1c2VybmFtZSI6ICJtb21vIn0=",
    signature:
      "fd37abbee777e13eaa0d0690d184e4d7e2fb43977281ab0e20701721f07a0e07",
  };
};

const generateSignature = (secretKey: string) => {
  return crypto.createHmac("sha256", secretKey);
};
