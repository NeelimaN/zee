import axios from "axios";

export const publicAPI = axios.create({
  baseURL: `https://jsonplaceholder.typicode.com/`,
});
