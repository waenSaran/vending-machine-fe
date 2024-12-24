import axios from "axios";

export const fetchMoney = async () => {
  const res = await fetch("/api/money");
  const data = await res.json();
  return data;
};

export const updateMoney = async (data: any) => {
  const res = await axios.put("/api/money", data);
  return res.data;
};