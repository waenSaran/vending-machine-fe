export type Products = {
  id: number;
  name: string;
  subCategoryId: number;
  categoryId: number;
  price: number;
  amount: number;
  imageUrl: string;
}

export type ItemCart = Products & {
  count: number
}