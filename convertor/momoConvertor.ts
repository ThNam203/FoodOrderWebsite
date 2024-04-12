import { momoOrderData, momoSecretData } from "@/fakedata/momoData";
import CryptoJS from "crypto-js";

const CreateDataForPayment = (amount: number) => {
  const dataToGenerateSignature = {
    partnerCode: momoSecretData.partnerCode,
    partnerName: momoSecretData.partnerName,
    storeId: momoSecretData.partnerCode,
    requestType: momoOrderData.requestType,
    ipnUrl: momoOrderData.notifyUrl,
    redirectUrl: momoOrderData.returnUrl,
    orderId: momoOrderData.orderId,
    amount: amount,
    lang: momoOrderData.lang,
    autoCapture: momoOrderData.autoCapture,
    orderInfo: momoOrderData.orderInfo,
    requestId: momoOrderData.requestId,
    extraData: momoOrderData.extraData,
  };
  const paymentInfo = {
    ...dataToGenerateSignature,
    signature: generateSignature(dataToGenerateSignature),
  };

  return paymentInfo;
};

const createRawSignature = (data: any) => {
  var rawSignature =
    "accessKey=" +
    momoSecretData.accessKey +
    "&amount=" +
    data.amount +
    "&extraData=" +
    data.extraData +
    "&ipnUrl=" +
    data.notifyUrl +
    "&orderId=" +
    data.orderId +
    "&orderInfo=" +
    data.orderInfo +
    "&partnerCode=" +
    momoSecretData.partnerCode +
    "&redirectUrl=" +
    data.returnUrl +
    "&requestId=" +
    data.requestId +
    "&requestType=" +
    data.requestType;
  return rawSignature;
};

const encryptSignature = (data: string, secretKey: string) => {
  const hash = CryptoJS.HmacSHA256(createRawSignature(data), secretKey);
  const signature = CryptoJS.enc.Hex.stringify(hash);
  return signature;
};

const generateSignature = (data: any) => {
  return encryptSignature(createRawSignature(data), momoSecretData.secretKey);
};

export { CreateDataForPayment };
