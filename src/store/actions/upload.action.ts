import api from '@/api/axios-client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllProjectUploadFiles = createAsyncThunk(
  'getAllProjectUploadFiles',
  async (
    {
      projectId,
      body,
    }: {
      projectId: string;
      body: {
        search?: string;
        pageNumber?: number;
        pageSize?: number;
        sorts?: { key: string; sort: number }[];
        filters?: { key: string; value: string[] }[];
      };
    },
    thunkAPI
  ) => {
    try {
      const response = await api.post(
        `/v1/ProjectFile/get-all-paging/${projectId}`,
        body
      );

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


export const uploadChunkFile = createAsyncThunk(
  'upload/uploadChunkFile',
  async (
   {
      projectId,
      index,
      chunkCount,
      cancelUpload,
      formFile
    }: {
      projectId: string;
      index: number;
      chunkCount: number;
      cancelUpload: boolean;
      formFile: Blob;
    },
    thunkAPI
  ) => {
    try {
   const formData = new FormData();

      formData.append("projectId", projectId);
      formData.append("index", index.toString());
      formData.append("chunkCount", chunkCount.toString());
      formData.append("cancelUpload", cancelUpload.toString());
      formData.append("formFile", formFile); 
      const response = await api.post(
        '/v1/ProjectFile/upload-chunk',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status < 400) {
        return response.data;
      }

      return thunkAPI.rejectWithValue([response.data]);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        return thunkAPI.rejectWithValue(['Network error!']);
      }

      const errorData = error?.response?.data;
      return thunkAPI.rejectWithValue(errorData?.errors ?? ['Upload error!']);
    }
  }
);
