import { Money } from '@/types/money';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface MoneyStore {
  moneyList: Money[];
  setMoney: (data: Money[]) => void;
}

const useMoneyStore = create<MoneyStore>()(
  devtools(
    persist(
      (set) => ({
        moneyList: [],
        setMoney: (data: Money[]) => set({ moneyList: data })
      }),
      {
        name: 'storage',
      },
    ),
  ),
);

export default useMoneyStore;