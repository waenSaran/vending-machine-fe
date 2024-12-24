import { transformResponse } from "@/utils/transformResponse";
import { API_URL } from "../constants";
import axios from "axios";
 
export async function GET(_req: Request) {
  const res = await fetch(API_URL + "/money")
  const data = await res.json()
  return Response.json(transformResponse(data))
}

export async function PUT(req: Request) {
  const body = await req.json()
  const res = await axios.put(API_URL + "/money", body)
  return Response.json(res.data)
}