import { configureStore } from "@reduxjs/toolkit";
import modeReducer from "../features/modeSlice";
import itemReducer from "../features/itemSlice";
import wallReducer from "../features/wallSlice";

export const store = configureStore({
  reducer: {
    mode: modeReducer,
    item: itemReducer,
    wall: wallReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
