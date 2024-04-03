import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profile";
import preloaderReducer from "./slices/preloader";
import foodReducer from "./slices/food";
import foodCategoryReducer from "./slices/category";
import sidebarReducer from "./slices/sidebar";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    preloader: preloaderReducer,
    food: foodReducer,
    foodCategory: foodCategoryReducer,
    sidebar: sidebarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
