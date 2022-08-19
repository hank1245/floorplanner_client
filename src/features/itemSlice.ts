import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
  x: number;
  y: number;
}

interface InitialState {
  items: Item[];
}

const initialState: InitialState = {
  items: [],
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    moveItem: (state, action) => {
      const movedItem = action.payload;
      console.log(movedItem);

      const filteredItems = state.items.filter(
        (item) => item.id !== movedItem.id
      );
      state.items = [...filteredItems, movedItem];
    },
  },
});

export const { addItem, setItems, removeItem, moveItem } = itemSlice.actions;

export default itemSlice.reducer;
