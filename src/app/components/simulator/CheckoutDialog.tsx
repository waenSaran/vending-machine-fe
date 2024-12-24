import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Money } from '@/types/money';
import { IconButton, Input, Stack } from '@mui/joy';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import useCartStore from '@/stores/cartStore';
import useMoneyStore from '@/stores/moneyStore';
import toast from 'react-hot-toast';

export default function CheckoutDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputMoney, setInputMoney] = useState<{ [value: number]: number; }>({});
  const { totalPrice, setTotalPrice } = useCartStore()
  const { moneyList, setMoney } = useMoneyStore()

  const totalPaid = useMemo(() => Object.keys(inputMoney).reduce((acc, key) => acc + Number(key) * inputMoney[Number(key)], 0), [inputMoney])
  const changes = useMemo(() => totalPaid - totalPrice, [totalPrice, totalPaid])
  const isLack = useMemo(() => changes < 0, [changes])

  useEffect(() => {
    const fetchMoney = async () => {
      const res = await fetch("/api/money");
      const data = await res.json();
      setMoney(data);
    };

    fetchMoney();
  }, []);

  const handleOnChangeMoney = (value: number, action: 1 | -1) => {
    setInputMoney((prev) => ({
      ...prev,
      [value]: (prev[value] || 0) + action,
    }));
  };

  const onPaymentSuccess = () => {
    // update money in stock and product in db
    setTotalPrice(0);
    setInputMoney({});
  };

  const handleOnConfirm = async () => {
    setLoading(true);
    
    // update money in stock from user input
    let moneyInStock: Money[] = moneyList
    Object.entries(inputMoney).forEach(([key, value]) => {
      const index = moneyInStock.findIndex((item) => item.value === (+key));
      if (index !== -1) {
        moneyInStock[index].amount += value;
      } else {
        const existing = moneyList.find((item) => item.value === (+key)) ?? { id: (+key), value: +key };
        moneyInStock.push({ ...existing, amount: 1 });
      }
    })

    // calculate change
    // rearrange money from biggest to smallest
    let changeResult: { [value: number]: number; } = {}
    let tmpChanges = changes
    moneyInStock = moneyInStock.sort((a, b) => b.value - a.value);
    for (let i = 0; i < moneyInStock.length; i++) {
      while (tmpChanges >= moneyInStock[i].value && moneyInStock[i].amount > 0) {
        const currValue = moneyInStock[i].value
        changeResult[currValue] = (changeResult[currValue] || 0) + 1;
        moneyInStock[i].amount -= 1
        tmpChanges -= currValue;
      }
    }

    if (tmpChanges === 0) {
      toast.success("Payment success!", {
        duration: 5000,
      })
      onPaymentSuccess();
      setOpen(false);
    } else {
      toast.error("Unfortunately, our money is out of stock\n Please try with another value of money", {
        duration: 5000,
      })
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="solid"
        color="success"
        onClick={() => setOpen(true)}
      >
        Checkout
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            Payment Simulator
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ gap: 2 }}>
            <Stack direction="column">
              <div className="money-list-container grid grid-cols-2 gap-2">
                {moneyList.map((item) => (
                  <div className='grid grid-cols-4 gap-4' key={`money-item-${item.id}`}>
                    <div className='text-right my-auto'>{item.value.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 })}</div>
                    <div className='col-span-3 flex gap-1'>
                      <IconButton disabled={!inputMoney[item.value] || inputMoney[item.value] <= 0} onClick={() => handleOnChangeMoney(item.value, -1)} size='sm' variant='outlined'>
                        <IoMdRemove />
                      </IconButton>
                      <Input
                        sx={{ input: { textAlign: "center", cursor: "initial" }, cursor: "initial", maxWidth: "100px" }}
                        readOnly
                        size="sm"
                        value={inputMoney[item.value] || 0}
                      />
                      <IconButton onClick={() => handleOnChangeMoney(item.value, 1)} size='sm' variant='outlined'>
                        <IoMdAdd />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Stack>
            <Divider />
            <div className='grid grid-cols-3'>
              <div></div>
              <div className='col-span-2 grid grid-cols-2'>
                  <div className='text-right my-auto'>Total</div>
                  <div className='text-right my-auto'>{totalPrice.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>
                  <div className='text-right my-auto'>Your paid</div>
                  <div className='text-right my-auto'>{totalPaid.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>
                  <div className={`text-right my-auto ${isLack ? "text-red-700" : "text-sky-700"}`}>{isLack ? "Lack" : "Change"}</div>
                  <div className={`text-right my-auto font-bold ${isLack ? "text-red-700" : "text-sky-700"}`}>{changes.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</div>
              </div>
              </div>
          </DialogContent>
          <DialogActions>
            <Button disabled={isLack} loading={loading} variant="solid" color="success" onClick={handleOnConfirm}>
              Proceed payment
            </Button>
            <Button loading={loading} variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
