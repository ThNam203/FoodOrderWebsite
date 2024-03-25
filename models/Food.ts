export type FoodSize = {
  id: number;
  name: string;
  price: number;
  weight: number;
  note: string;
  quantity: number;
  foodId: number;
};

export type Food = {
  id: number;
  name: string;
  description: string;
  image: string;
  isDeleted: boolean;
  foodSizes: FoodSize[];
  categoryId: number;
  rating: number;
  tags: string[];
  currency: string;
};
