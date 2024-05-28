import { Food, FoodStatus } from "@/models/Food";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const getActiveFood = (food: Food[] | undefined) => {
  if (!food) return [];
  return food.filter((f) => f.status === FoodStatus.ACTIVE);
};

const getFood = (food: Food[] | undefined) => {
  if (!food) return [];
  return food.filter((f) => f.isDeleted === false);
};

export const foodSlice = createSlice({
  name: "food",
  initialState: {
    activeFood: [] as Food[],
    allFood: [] as Food[],
  },
  reducers: {
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.allFood = getFood(action.payload);
      state.activeFood = getActiveFood(state.allFood);
    },
    addFood: (state, action: PayloadAction<Food>) => {
      const food = action.payload;
      if (food.isDeleted) return;
      state.allFood.push(action.payload);
      if (food.status === FoodStatus.ACTIVE)
        state.activeFood.push(action.payload);
    },
    addFoods: (state, action: PayloadAction<Food[]>) => {
      action.payload.forEach((food) => {
        if (!food.isDeleted) {
          state.allFood.push(food);
          if (food.status === FoodStatus.ACTIVE) state.activeFood.push(food);
        }
      });
    },
    deleteFood: (state, action: PayloadAction<number>) => {
      state.allFood = state.allFood.filter((f) => f.id !== action.payload);
      state.activeFood = getActiveFood(state.allFood);
    },
    updateFood: (state, action: PayloadAction<Food>) => {
      state.allFood = state.allFood.map((food) =>
        food.id === action.payload.id ? action.payload : food
      );
      state.activeFood = getActiveFood(state.allFood);
    },
  },
});

export const { setFoods, addFood, addFoods, deleteFood, updateFood } =
  foodSlice.actions;
export default foodSlice.reducer;
