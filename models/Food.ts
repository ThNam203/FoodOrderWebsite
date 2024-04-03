export type FoodSize = {
  id: number;
  name: string;
  price: number;
  weight: number;
  note: string;
};

export type FoodCategory = {
  id: number;
  name: string;
  image: string;
};

export type Food = {
  id: number;
  name: string;
  description: string;
  images: string[];
  isDeleted: boolean;
  foodSizes: FoodSize[];
  category: FoodCategory;
  rating: number;
  tags: string[];
  createdDate: string;
};
