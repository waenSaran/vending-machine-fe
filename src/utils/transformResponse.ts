import { Products } from "@/types/products";
import _ from "lodash";

export const transformProducts = (data: any) => {
  const products = data.map((product: any) => {
    const result = Object.keys(product).reduce((acc: any, key: any) => {
      let value = product[key];
      if (key === "image_url" && !value) {
        value = "/app/no-image-available.svg"
      }
      acc[_.camelCase(key)] = value;
      return acc;
    }, {});
    return result as Products
  })
  return products;
};

export const transformResponse = (data: any) => {
  const result = data.map((item: any) => {
    const res = Object.keys(item).reduce((acc: any, key: any) => {
      let value = item[key];
      acc[_.camelCase(key)] = value;
      return acc;
    }, {});
    return res
  })
  return result;
};