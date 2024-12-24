import { MAX_ITEM, renderItemDetails } from "@/app/page";
import useCartStore from "@/stores/cartStore";
import { ItemCart } from "@/types/products";
import { Button, DialogActions, IconButton, Input, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useEffect, useState } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";

interface Props {
  itemCart: ItemCart
  totalItem: number
}
const EditItemDialog = ({ itemCart, totalItem }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0)
  const { cart, setCart } = useCartStore()

  useEffect(()=> {
    setAmount(itemCart.count)
  }, [])
  
  const handleOnEditItem = () => {
    setOpen(true)
  }

  const handleOnManageItem = (action: 1 | -1) => {
    setAmount(prev => prev + action)
  }

  const handleOnDeleteItem = () => {
    const newCart = { ...cart }
    delete newCart[itemCart.id]
    setCart(newCart)
  }
  
  const handleOnConfirm = () => {
    let newCart = { ...cart }
    newCart[itemCart.id].count = amount
    if(newCart[itemCart.id].count <= 0) {
      delete newCart[itemCart.id]
    }
    setCart(newCart)
    setOpen(false)
  }

  return (
    <div key={`edit-item-${itemCart.id}`}>
      <IconButton  onClick={handleOnEditItem}>
        <RiPencilFill />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog>
          <ModalClose />
          {renderItemDetails(itemCart)}
          <div className="manage-item flex justify-center">
            <IconButton disabled={amount <= 0} onClick={() => handleOnManageItem(-1)}>
              <IoMdRemove />
            </IconButton>
            <Input 
              sx={{ input: { textAlign: "center", cursor: "initial" }, cursor: "initial", maxWidth: "100px" }} 
              readOnly 
              size="sm" 
              value={amount}
            />
            <IconButton disabled={(totalItem - itemCart.count + amount) >= MAX_ITEM || (amount >= itemCart.amount)} onClick={() => handleOnManageItem(1)}>
              <IoMdAdd />
            </IconButton>
          </div>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button variant="solid" color="primary" onClick={handleOnConfirm}>
              Confirm
            </Button>
            <Button disabled={amount <= 0} variant="plain" color="danger" onClick={handleOnDeleteItem}>
              Delete this item
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  )
}

export default EditItemDialog