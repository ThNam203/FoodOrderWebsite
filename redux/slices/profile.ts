import { User } from "@/models/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    value: null as User | null,
    isLogin: false,
  },
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
      state.isLogin = action.payload != null;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
