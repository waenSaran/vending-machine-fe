import { transformProducts } from "@/utils/transformResponse";
import { API_URL } from "../constants";
import axios from "axios";

export async function GET(_req: Request) {
  const res = await axios.get(API_URL + "/products")
  return Response.json(transformProducts(res.data))
}