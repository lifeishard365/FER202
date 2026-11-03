import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:9999",
});

export const getFood = () => API.get("/foods");
export const getCategory = () => API.get("/categorys");
export const getRestaurant = () => API.get("/restaurants");
export const getOrder = () => API.get("/orders");
export const getUser = () => API.get("/users");
export const addFood = (Food) => API.post("/foods", Food);