import axios from "axios";
import data from "@/public/province/db.json";

const getAllProvinces = () => {
  return Promise.all(data.province);
};

const getDistrictsByProvinceId = (provinceId: string) => {
  return Promise.all(data.district.filter((d) => d.idProvince === provinceId));
};

const AddressService = {
  getAllProvinces,
  getDistrictsByProvinceId,
};

export default AddressService;
