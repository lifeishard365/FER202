import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:9999",
});

export const getFood = () => API.get("/foods");
export const getCategory = () => API.get("/categories");
export const getRestaurant = () => API.get("/restaurants");
export const getOrder = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getUser = () => API.get("/users");
export const addFood = (Food) => API.post("/foods", Food);
export const updateFood = (id, food) => API.patch(`/foods/${id}`, food);
export const deleteFood = (id) => API.delete(`/foods/${id}`);
export const getReview = () => API.get("/reviews");
export const addReview = (Review) => API.post("/reviews", Review);