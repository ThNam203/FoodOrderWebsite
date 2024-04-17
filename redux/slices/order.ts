import { Food } from "@/models/Food";
import { Order } from "@/models/Order";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [] as Order[],
  },
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    addOrders: (state, action: PayloadAction<Order[]>) => {
      action.payload.forEach((product) => {
        state.orders.push(product);
      });
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      state.orders = state.orders.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
  },
});

export const { addOrder, addOrders, deleteOrder, setOrders, updateOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
