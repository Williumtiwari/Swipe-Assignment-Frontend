import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      state.push(action.payload);
    },
    deleteItem: (state, action) => {
      return state.filter((item) => item.itemId !== action.payload);
    },
    updateItem: (state, action) => {
      const index = state.findIndex(
        (item) => item.itemId === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedItem;
      }
    },
  },
});

export const { addItem, deleteItem, updateItem } = itemSlice.actions;

export const selectItemsList = (state) => state.items;

export default itemSlice.reducer;
