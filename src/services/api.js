import axios from "axios";

const api = axios.create({
  baseURL: "https://omnistack-backweekend.herokuapp.com"
});

export default api;
