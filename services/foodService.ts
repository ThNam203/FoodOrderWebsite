import { Food, FoodCategory } from "@/models/Food";
import AxiosService from "./axiosService";

const createNewCategory = (data: any) => {
  return AxiosService.post<FoodCategory>("/api/categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getCategories = () => {
  return AxiosService.get<FoodCategory[]>("/api/categories");
};

const getAllFood = () => {
  return AxiosService.get<Food[]>("/api/foods");
};

const createNewFood = (data: any) => {
  return AxiosService.post<Food>("/api/foods", data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

const updateFood = (id: number, data: any) => {
  return AxiosService.put<Food>(`/api/foods/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteFood = (id: number) => {
  return AxiosService.delete(`/api/foods/${id}`);
};

const FoodService = {
  createNewCategory,
  getCategories,
  getAllFood,
  createNewFood,
  updateFood,
  deleteFood,
};

export default FoodService;
