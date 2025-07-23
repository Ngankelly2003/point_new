import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios-client";
import { RequestLoginType, ResponseLoginType } from "@/models/auth/LoginType";
export const login = createAsyncThunk(
    'login',
    async (payload: RequestLoginType, thunkAPI) => {
        try {
            const response = await api.post('v1/Auth/sign-in', payload)

            if (response.status < 400) {
                return response.data;
            }

            return thunkAPI.rejectWithValue([response.data]);
        } catch (error: any) {
            if ('code' in error && error.code === 'ERR_NETWORK') {
                return thunkAPI.rejectWithValue(['Network error!']);
            }

            const errorData = error?.response?.data as ResponseLoginType | undefined;
            return thunkAPI.rejectWithValue(errorData?.errors ?? ['Network error!']);
        }
    }
)


// export const revokeToken = createAsyncThunk(
//     'revokeToken',
//     async (payload: any, thunkAPI) => {
//         try {
//             const response = await api.post('v1/Token/revoke', payload)

//             if (response.status < 400) {
//                 return response.data;
//             }

//             return thunkAPI.rejectWithValue([response.data]);
//         } catch (error: any) {
//             if ('code' in error && error.code === 'ERR_NETWORK') {
//                 return thunkAPI.rejectWithValue(['Network error!']);
//             }
//             const errorData = error?.response?.data as any | undefined;
//             return thunkAPI.rejectWithValue(errorData?.errors ?? ['Network error!']);
//         }
//     }
// )