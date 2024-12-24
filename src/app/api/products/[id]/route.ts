import axios from "axios";
import { API_URL } from "../../constants";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const res = await axios.put(`${API_URL}/product/${id}`, body)
  return Response.json(res.data)
}