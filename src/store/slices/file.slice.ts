import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

const initialState = { 
};

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});
export const selectFile = (state: RootState) => state.file;
export default fileSlice.reducer;