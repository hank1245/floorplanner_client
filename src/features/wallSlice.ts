import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type wall = number[];

interface InitialState {
  walls: wall[];
}

const initialState: InitialState = {
  walls: [],
};

export const wallSlice = createSlice({
  name: "wall",
  initialState,
  reducers: {
    setWalls: (state, action) => {
      state.walls = action.payload;
    },
    addWall: (state, action) => {
      state.walls.push(action.payload);
    },
    removeWall: (state, action) => {},
  },
});

export const { setWalls, addWall, removeWall } = wallSlice.actions;

export default wallSlice.reducer;
