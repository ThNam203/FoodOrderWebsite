import { FoodFormData } from "@/components/NewFoodForm/new_food_form";
import { Cart } from "@/models/Cart";
import { Food, FoodCategory } from "@/models/Food";
import { useAppSelector } from "@/redux/hooks";

const FoodToSend = (food: Food) => {
  const toSend = {
    name: food.name,
    description: food.description,
    category: {
      id: food.category.id,
    },
    tags: food.tags,
    status: food.status,
    foodSizes: food.foodSizes.map((size) => {
      return {
        name: size.name,
        price: size.price,
        weight: size.weight,
        note: size.note,
      };
    }),
  };
  return toSend;
};

const FoodFormDataToFood = (formData: FoodFormData, category: FoodCategory) => {
  const food: Food = {
    id: 0,
    name: formData.name,
    description: formData.description,
    images: [],
    isDeleted: false,
    foodSizes: formData.sizes.map((size) => {
      return {
        id: 0,
        name: size.sizeName,
        price: size.price,
        weight: size.weight,
        note: size.note,
      };
    }),
    category: category,
    rating: 0,
    tags: [],
    status: formData.status,
    createdDate: new Date().toString(),
  };
  return food;
};

const FoodToReceive = (data: any): Food => {
  const foodReceived: Food = {
    id: data.id,
    name: data.name,
    description: data.description,
    images: data.images,
    isDeleted: data.isDeleted,
    foodSizes: data.foodSizes,
    category: data.category,
    rating: data.rating,
    tags: data.tags,
    status: data.status,
    createdDate: data.createdDate,
  };
  return foodReceived;
};

export { FoodToSend, FoodToReceive, FoodFormDataToFood };
