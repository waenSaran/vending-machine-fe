import { transformProducts } from "@/utils/transformResponse";
import { API_URL } from "../constants";

export async function GET(_req: Request) {
  const res = await fetch(API_URL + "/products")
  const data = await res.json()

  return Response.json(transformProducts(data))
}