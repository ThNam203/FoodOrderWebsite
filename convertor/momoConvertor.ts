import * as crypto from "crypto";

const CreateDataForPayment = () => {
  const data = {
    partnerCode: "MOMO",
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestType: "captureWallet",
    ipnUrl: "http://localhost:3000",
    redirectUrl: "http://localhost:3000",
    orderId: "MM1540456472575",
    amount: 150000,
    lang: "vi",
    orderInfo: "SDK team.",
    requestId: "MM1540456472575",
    extraData: "eyJ1c2VybmFtZSI6ICJtb21vIn0=",
  };
  const partnerCode = "MOMO";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const accessKey = "F8BBA842ECF85";
  const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${data.requestId}&amount=${data.amount}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&returnUrl=${data.redirectUrl}&notifyUrl=${data.ipnUrl}&extraData=${data.extraData}`;
  const signature = convertorToSignature(rawSignature, secretKey);
  console.log(signature);
  return {
    ...data,
    signature: signature,
  };
};

const convertorToSignature = (data: string, secretKey: string) => {
  return crypto.createHmac("sha256", secretKey).update(data).digest("hex");
};
export { CreateDataForPayment };
