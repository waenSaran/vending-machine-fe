import { Products } from "@/types/products";
import axios from "axios";

export const fetchProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data;
};

export const updateStock = async (id: number, data: Products) => {
  const res = await axios.put(`/api/products/${id}`, data);
  return res.data;
};