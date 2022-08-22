import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface wall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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
    removeWall: (state, action) => {
      state.walls = state.walls.filter((wall) => wall.id !== action.payload);
      console.log(state.walls);
    },
  },
});

export const { setWalls, addWall, removeWall } = wallSlice.actions;

export default wallSlice.reducer;
