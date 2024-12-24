"use client"
import Image from "next/image";
import "../../next.config"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Products } from "@/types/products";
import toast, { Toaster } from "react-hot-toast";
import Summary from "./components/simulator/Summary";
import { Button, Card } from "@mui/joy";
import useCartStore from "@/stores/cartStore";

const categories = [
  {
    id: 1,
    name: "All",
  },
  {
    id: 2,
    name: "Category 1",
  },
  {
    id: 3,
    name: "Category 2",
  },
  {
    id: 4,
    name: "Category 3",
  }
]

export const renderItemDetails = (item: Products) => {
  return (
    <div className="details flex flex-col gap-4" key={`item-details-${item.id}`}>
      <Image className="mx-auto h-48 w-auto" style={{ objectFit: "contain" }} src={item.imageUrl} alt={item.name} width={100} height={100} /><div className="detail-section">
        <div className="head flex justify-between gap-2">
          <div className="font-bold">
            {item.name}
          </div>
          <div>
            {item.price.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
          </div>
        </div>
        <p className="text-sm text-gray-400">{item.amount} left</p>
      </div>
    </div>
  )
}

export const MAX_ITEM = 10

export default function Home() {
  const [items, setItems] = useState<Products[]>([])
  const { cart, setCart } = useCartStore()
  const total = useMemo(() => Object.values(cart).reduce((acc, item) => acc + item.count, 0), [cart])

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("api/products")
      const data = await res.json() as Products[]
      setItems(data)
    }
    fetchItems()
  }, [])

  const handleAddToCart = (item: Products) => {
    if (total >= MAX_ITEM) {
      toast.error(`Please don't buy more than\n${MAX_ITEM} items at once`)
      return
    };
    setCart(({  
      ...cart,
      [item.id]: {
        ...(cart[item.id] ?? item),
        count: (cart[item.id]?.count || 0) + 1
      }
    }))
  }
  
  const totalPrice = useCallback(() => {
    let result = 0
    Object.keys(cart).forEach((key) => {
      result += cart[+key].count * cart[+key].price
    })
    return result
  }, [cart])
  
  return (
    <div className="p-10">
      <Toaster />
      <div className="content-container grid lg:grid-cols-4 grid-cols-1 gap-4">
        <div className="item-list grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:col-span-3 gap-2">
          {items.map((item) => (
            <Card className="flex flex-col justify-between" key={item.id}>
                {renderItemDetails(item)}
                <Button 
                  onClick={() => handleAddToCart(item)} 
                  disabled={item.amount == 0 || item.amount <= cart[item.id]?.count}
                >
                  {item.amount == 0 || item.amount <= cart[item.id]?.count ? "Out of stock" : "+ Add to cart"}
                </Button>
            </Card>
          ))}
        </div>
        <Summary cart={cart} total={total} totalPrice={totalPrice} />
      </div>
    </div>
  );
}
