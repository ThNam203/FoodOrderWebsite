import { Food } from "@/models/Food";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const getActiveFood = (food: Food[]) => {
  return food.filter((f) => !f.isDeleted);
};

export const foodSlice = createSlice({
  name: "food",
  initialState: {
    activeFood: [] as Food[],
    allFood: [] as Food[],
  },
  reducers: {
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.activeFood = getActiveFood(action.payload);
      state.allFood = action.payload;
    },
    addFood: (state, action: PayloadAction<Food>) => {
      state.allFood.push(action.payload);
      state.activeFood.push(action.payload);
    },
    addFoods: (state, action: PayloadAction<Food[]>) => {
      action.payload.forEach((product) => {
        state.activeFood.push(product);
        state.allFood.push(product);
      });
    },
    deleteFood: (state, action: PayloadAction<number>) => {
      state.allFood = state.allFood.filter(
        (f) => f.id !== action.payload
      );
      state.activeFood = getActiveFood(state.allFood);
    },
    updateFood: (state, action: PayloadAction<Food>) => {
      state.allFood = state.allFood.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      state.activeFood = getActiveFood(state.allFood);
    },
  },
});

export const { setFoods, addFood, addFoods, deleteFood, updateFood } =
  foodSlice.actions;
export default foodSlice.reducer;
