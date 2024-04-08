import { FoodCategory } from "@/models/Food";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const foodCategorySlice = createSlice({
  name: "foodCategory",
  initialState: {
    value: [] as FoodCategory[],
  },
  reducers: {
    setFoodCategories: (state, action: PayloadAction<FoodCategory[]>) => {
      state.value = action.payload;
    },
    addFoodCategory: (state, action: PayloadAction<FoodCategory>) => {
      state.value.push(action.payload);
    },
  },
});

export const { setFoodCategories, addFoodCategory } = foodCategorySlice.actions;
export default foodCategorySlice.reducer;
