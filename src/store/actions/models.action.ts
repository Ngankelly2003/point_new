import api from "@/api/axios-client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getModels = createAsyncThunk(
  'getModels',
  async (projectId: string, thunkAPI) => {
    try {
      const response = await api.get(`v1/ProjectFile/view/${projectId}`)

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue([response.data]);
    } catch (error: any) {
      if ('code' in error && error.code === 'ERR_NETWORK') {
        return thunkAPI.rejectWithValue(['Network error!']);
      }
      const errorData = error?.response?.data as any | undefined;
      return thunkAPI.rejectWithValue(errorData?.errors ?? ['Network error!']);
    }
  }
);