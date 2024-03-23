import axios from "axios";
import AxiosService from "./axiosService";

const getAllProvinces = () => {
  return axios.get("https://vapi.vnappmob.com/api/province");
};

const getDistrictsByProvinceId = (provinceId: number) => {
  return axios.get(
    `https://vapi.vnappmob.com/api/province/district/${provinceId}`
  );
};

const AddressService = {
  getAllProvinces,
  getDistrictsByProvinceId,
};

export default AddressService;
