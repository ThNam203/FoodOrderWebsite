import { Food, FoodCategory } from "@/models/Food";
import AxiosService from "./axiosService";
import { Comment } from "@/models/Comment";
import { format } from "date-fns";
import { ToFoodReport, ToMonthlyReport } from "@/convertor/reportConvertor";

const dateToUrlPath = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

const createNewCategory = (data: any) => {
  console.log(data);
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

// const getTopFoodInMonthRange = () => {
//   const today = new Date();
//   const first = new Date(today.getFullYear(), today.getMonth(), 1);
//   return AxiosService.get<any>(
//     `/api/reports/top-food-by-order?start=${first.getFullYear()}-${
//       first.getMonth() + 1
//     }-${first.getDate()}&end=${today.getFullYear()}-${
//       today.getMonth() + 1
//     }-${today.getDate()}`
//   );
// };

const getTopFoodInMonthRange = () => {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const url = `/api/reports/top-food-by-order?start=${dateToUrlPath(
    first
  )}&end=${dateToUrlPath(today)}`;
  return AxiosService.get<any>(url).then((res) => ToFoodReport(res.data));
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

const getAllComments = (foodId: number) => {
  return AxiosService.get<Comment[]>(`/api/comments/${foodId}`);
};

const uploadNewComment = (foodId: number, data: any) => {
  return AxiosService.post<Comment>(`/api/comments/${foodId}`, data, {
    withCredentials: true,
  });
};

const getFavouriteFoods = () => {
  return AxiosService.get<Food[]>("/api/food-favorite");
};

const addFavouriteFood = (id: number) => {
  return AxiosService.post(`/api/food-favorite/${id}`);
};

const removeFavouriteFood = (id: number) => {
  return AxiosService.delete(`/api/food-favorite/${id}`);
};

const FoodService = {
  createNewCategory,
  getCategories,
  getAllFood,
  createNewFood,
  updateFood,
  deleteFood,
  getFavouriteFoods,
  addFavouriteFood,
  removeFavouriteFood,
  getTopFoodInMonthRange,
  getAllComments,
  uploadNewComment,
};

export default FoodService;
