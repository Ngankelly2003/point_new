
import api from "@/api/axios-client";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getProject = createAsyncThunk(
  'getProject',
  async (payload: any, thunkAPI) => {
    try {
      const response = await api.post('/v1/Project/get-all-paging', payload);

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue([response.data]);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        return thunkAPI.rejectWithValue(['Network error!']);
      }
      const errorData = error?.response?.data;
      return thunkAPI.rejectWithValue(errorData?.errors ?? ['Network error!']);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/create',
  async (formData: any, thunkAPI) => {
    try {
      const response = await api.post('/v1/Project/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.errors ?? ['Network error!']);
    }
  }
);


export const deleteProjects = createAsyncThunk(
  "deleteProject",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.delete(`v1/Project/delete/${id}`); 

      if (response.status < 400) {
        return response.data;
      }
      return thunkAPI.rejectWithValue([response.data]);
    } catch (error: any) {
      if ("code" in error && error.code === "ERR_NETWORK") {
        return thunkAPI.rejectWithValue(["Network Error"]);
      }
      return thunkAPI.rejectWithValue(
        error?.response?.data.errors ?? ["Unknown"]
      );
    }
  }
);
