import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4`;

export const getResources = createAsyncThunk(
  "resources/getResources",
  async () => {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/list`,
    });

    return response.data;
  }
);

export const addResources = createAsyncThunk(
  "resources/addResources",
  async (values) => {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/list`,
      data: JSON.stringify(values),
    });

    return response.data;
  }
);

export const editResources = createAsyncThunk(
  "resources/editResources",
  async (values) => {
    const response = await axios({
      method: "PUT",
      url: `${API_URL}/list`,
      data: JSON.stringify(values),
    });

    return response.data;
  }
);

export const deleteResources = createAsyncThunk(
  "resources/deleteResources",
  async (values) => {
    const response = await axios({
      method: "DELETE",
      url: `${API_URL}/list`,
      data: JSON.stringify(values),
    });

    return response.data;
  }
);

export const getLocations = createAsyncThunk(
  "locations/getLocations",
  async () => {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/option_area`,
    });

    return response.data;
  }
);

export const getSizes = createAsyncThunk("sizes/getSizes", async () => {
  const response = await axios({
    method: "GET",
    url: `${API_URL}/option_size`,
  });

  return response.data;
});
