import { ItemCart } from '@/types/products';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartStore {
  cart: { [n: number]: ItemCart; };
  totalPrice: number;
  setCart: (cart: { [n: number]: ItemCart; }) => void;
  setTotalPrice: (totalPrice: number) => void;
  resetCart: () => void;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        cart: {},
        totalPrice: 0,
        setCart: (cart: { [n: number]: ItemCart; }) => set({ cart }),
        resetCart: () => set({ cart: {} }),
        setTotalPrice: (totalPrice: number) => set({ totalPrice }),
      }),
      {
        name: 'storage',
      },
    ),
  ),
);

export default useCartStore;