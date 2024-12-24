export type Money = {
  id: number,
  value: number,
  amount: number
}

export type InputMoney = Money & {
  count: number
}