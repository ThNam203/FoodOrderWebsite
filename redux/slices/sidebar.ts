import { User } from "@/models/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    selectedLink: "/browse",
  },
  reducers: {
    setSelectedLink: (state, action: PayloadAction<string>) => {
      state.selectedLink = action.payload;
    },
  },
});

export const { setSelectedLink } = sidebarSlice.actions;
export default sidebarSlice.reducer;
