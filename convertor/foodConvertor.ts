import { FoodFormData } from "@/components/NewFoodForm/food_form";
import { Food, FoodCategory, FoodStatus } from "@/models/Food";
import { id } from "date-fns/locale";

const FoodToSend = (food: Food) => {
  const toSend = {
    name: food.name,
    description: food.description,
    category: {
      id: food.category.id,
    },
    images: food.images,
    tags: food.tags,
    status: food.status,
    foodSizes: food.foodSizes.map((size) => {
      return {
        id: size.id,
        name: size.name,
        price: size.price,
        weight: size.weight,
        note: size.note,
      };
    }),
    createAt: food.createdAt.toISOString(),
  };
  return toSend;
};

const FoodFormDataToFood = (formData: FoodFormData, category: FoodCategory) => {
  console.log(category);
  const images: string[] = [];
  formData.images.forEach((image) => {
    if (image === null) return;
    images.push(image);
  });
  const food: Food = {
    id: 0,
    name: formData.name,
    description: formData.description,
    images: images,
    isDeleted: false,
    foodSizes: formData.sizes.map((size) => {
      return {
        id: size.id ? size.id : 0,
        name: size.sizeName,
        price: size.price,
        weight: size.weight,
        note: size.note,
        deleted: false,
      };
    }),
    category: category,
    rating: 0,
    tags: formData.tags,
    status: formData.status as FoodStatus,
    createdAt: new Date(),
    purchased: false
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
    rating: data.totalRating,
    tags: data.tags,
    status: data.status === "true" ? FoodStatus.ACTIVE : FoodStatus.DISABLE,
    createdAt: new Date(data.createdAt),
    purchased: data.purchased,
  };
  return foodReceived;
};

export { FoodFormDataToFood, FoodToReceive, FoodToSend };
