import React, { useEffect } from 'react';
import EditItemDialog from './EditItemDialog';
import { Card, Divider } from '@mui/joy';
import CheckoutDialog from './CheckoutDialog';
import useCartStore from '@/stores/cartStore';

interface Props {
  cart: { [n: number]: any; };
  total: number;
  totalPrice: () => number;
}

function Summary({ cart, total, totalPrice }: Props) {
  const { setTotalPrice } = useCartStore()

  useEffect(() => {
    setTotalPrice(totalPrice())
  }, [totalPrice])

  return (
    <div className="summary">
      <Card style={{ position: "sticky", top: 8 }}>
        <div className="font-bold text-xl mb-4">Your Cart ({total})</div>
        <div className="cart-list flex flex-col gap-2">
          {Object.keys(cart).length > 0 && Object.values(cart).map((item) => (
            <div className="cart-item grid grid-cols-4" key={item.id}>
              <div className="col-span-2 flex">
                <EditItemDialog totalItem={total} itemCart={item} />
                <div>{item.name}</div>
              </div>
              <div className="text-center">
                x{item.count}
              </div>
              <div className="price text-right">
                <div className="text-nowrap">{item.price?.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>
                {item.count > 1 && <div className="text-sm text-nowrap text-slate-400">{(item.count * item.price)?.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>}
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="footer flex justify-between mt-2">
          <div className="font-bold">Total</div>
          <div className="font-bold">{totalPrice().toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>
        </div>
        <CheckoutDialog />
      </Card>
    </div>
  );
}

export default Summary;