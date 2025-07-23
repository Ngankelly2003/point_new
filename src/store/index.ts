
import { configureStore } from '@reduxjs/toolkit';
import { fileSlice } from "./slices/file.slice";
import { authSlice } from './slices/auth.slice';

export const store = configureStore({
        reducer: {
            [fileSlice.name]: fileSlice.reducer,
             [authSlice.name]: authSlice.reducer,
        },
        devTools: true
    });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
