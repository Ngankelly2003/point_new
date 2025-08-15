import api from "@/api/axios-client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getManagers = createAsyncThunk(
  'user/get-list-managers',
  async (payload: any, thunkAPI) => {
    try {

      let url = `v1/User/get-usersbase`;
      let query = payload.query
      const response = await api.get(url, query)

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

export const getUser = createAsyncThunk(
  'getUser',
  async (payload: any, thunkAPI) => {
    try {
      const response = await api.post('/v1/User/get-all', payload);

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



export const getSelectUsers = createAsyncThunk(
  'user/get-select-users',
  async (payload: any, thunkAPI) => {
    try {

      let url = `v1/Company/get-all`;
      let query = payload.query
      const response = await api.get(url, query)

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


export const createUser = createAsyncThunk(
  'user/create',
  async (formData: any, thunkAPI) => {
    try {
      const response = await api.post('/v1/User/add', formData, {
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


export const getUserOutSide = createAsyncThunk(
  'project/get-user-out-side',
   async (
    payload: {
      id: string;
      userAddedParam?: { pageNumber: number; pageSize: number };
      userAddParam?: { pageNumber: number; pageSize: number };
    },
    thunkAPI
  ) => {
    try {
      const {
        id,
        userAddedParam = { pageNumber: 0, pageSize: 10 },
        userAddParam = { pageNumber: 0, pageSize: 10 }
      } = payload;

      const response = await api.post(
        `/v1/Project/UserProjectPage/${id}`,
        { userAddedParam, userAddParam },
        {
          headers: {
            'Content-Type': 'application/json-patch+json'
          }
        }
      );

      if (response.status < 400) return response.data;
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


export const addUserToProj = createAsyncThunk(
  'addUserToProj',
  async (
    payload: { projectId: string; userIds: string[] },
    thunkAPI
  ) => {
    try {
      const response = await api.put(
        `/v1/Project/add-users/${payload.projectId}`,
        payload.userIds,
        {
          headers: {
            'Content-Type': 'application/json-patch+json'
          }
        }
      );

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data ?? ['Lỗi mạng hoặc dữ liệu!']);
    }
  }
);


export const removeUserToProj = createAsyncThunk(
  'removeUserToProj',
  async (
    payload: { projectId: string; userIds: string[] },
    thunkAPI
  ) => {
    try {
      const response = await api.put(
        `/v1/Project/remove-user/${payload.projectId}`,
        payload.userIds,
        {
          headers: {
            'Content-Type': 'application/json-patch+json'
          }
        }
      );

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data ?? ['Error Network!']);
    }
  }
);

 export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.delete(`v1/User/${id}`); 

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

export const updateUser = createAsyncThunk(
  'updateUser',
  async (
    payload: { id: string; data: any },
    thunkAPI
  ) => {
    try {
      const response = await api.put(
        `/v1/User/update/${payload.id}`,
        payload.data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data ?? ['Lỗi mạng hoặc dữ liệu!']);
    }
  }
);


