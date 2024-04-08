import { Cart } from "@/models/Cart";
import { Food } from "@/models/Food";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as Cart[],
  },
  reducers: {
    setCartItems: (state, action: PayloadAction<Cart[]>) => {
      state.cartItems = action.payload;
    },
    addCartItem: (state, action: PayloadAction<Cart>) => {
      state.cartItems.push(action.payload);
    },
    addCartItems: (state, action: PayloadAction<Cart[]>) => {
      action.payload.forEach((cartItem) => {
        state.cartItems.push(cartItem);
      });
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((f) => f.id !== action.payload);
    },
    updateCartItem: (state, action: PayloadAction<Cart>) => {
      state.cartItems = state.cartItems.map((cartItem) =>
        cartItem.id === action.payload.id ? action.payload : cartItem
      );
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  addCartItems,
  deleteCartItem,
  updateCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
