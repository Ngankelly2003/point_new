import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { login } from "../actions/auth.action";
import { ResponseLoginType } from "@/models/auth/LoginType";
import { storageRemove, storageSet } from "@/helpers/storage";
import { StorageKey } from "@/constants/storage-key";

export type AuthModel = {
    data: ResponseLoginType | undefined,
    isFetching: boolean,
    isError: boolean,
    isErrorRegister: boolean,
    isSuccess: boolean,
    isSuccessRegister: boolean,
    isSuccessForgotPass: boolean,
    errorMessage: string[],
    errorMessageRegister: string[],
}

const initialState: AuthModel = {
    data: undefined,
    isError: false,
    isErrorRegister: false,
    isFetching: false,
    isSuccess: false,
    isSuccessRegister: false,
    isSuccessForgotPass: false,
    errorMessage: [],
    errorMessageRegister: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutAuthAction(state) {
            state.data = undefined;
            state.isError = false;
            state.isFetching = false;
            state.isSuccess = false;

            storageRemove(StorageKey.TOKEN);
            storageRemove(StorageKey.REFRESH_TOKEN);
            storageRemove(StorageKey.EXPIRES);
            storageRemove(StorageKey.USER);
        },
        clearAuth(state) {
            state.data = undefined;
            state.isError = false;
            state.isErrorRegister = false;
            state.isFetching = false;
            state.isSuccess = false;
            // state.isSuccessRegister = false;
            // state.isSuccessForgotPass = false;
            // state.errorMessage = [];
            // state.errorMessageRegister = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.isFetching = true;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = [];
        }).addCase(login.fulfilled, (state, { payload }) => {
            state.isFetching = false;
            state.isError = false;
            state.isSuccess = true;
            state.errorMessage = [];
            const response = payload as ResponseLoginType;
            state.data = { ...response };

            storageSet(StorageKey.TOKEN, response.result.accessToken);
            storageSet(StorageKey.REFRESH_TOKEN, response.result.refreshToken);
            storageSet(StorageKey.EXPIRES, response.result.expires?.toString() ?? '');
            storageSet(StorageKey.USER, JSON.stringify(response.result.user));
            console.log(response)
        }).addCase(login.rejected, (state, { payload }) => {
            state.isFetching = false;
            state.isSuccess = false;
            state.isError = true;
            state.errorMessage = payload as string[];
        })
        
    },
});

export const selectAuth = (state: RootState) => state.auth;

export const { clearAuth, logoutAuthAction } = authSlice.actions

export default authSlice.reducer;