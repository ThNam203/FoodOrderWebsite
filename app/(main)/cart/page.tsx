"use client";
import { TextButton } from "@/components/buttons";
import { Input, NumberInput, TextArea } from "@/components/input";
import { Separate } from "@/components/separate";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { fakeCartData } from "./fakedata";
import { CartContent, CartTab } from "./cart_tab";
import { TabContent } from "@/components/tab";
const Title = ({
  className,
  content,
}: {
  className?: ClassValue;
  content: string;
}) => {
  return (
    <span
      className={cn(
        "text-secondaryWord text-lg font-semibold text-center",
        className
      )}
    >
      {content}
    </span>
  );
};

const TitleBar = () => {
  return (
    <div className="w-full flex flex-row items-center p-2">
      <Title content="Food" className="w-1/2 flex justify-self-start" />
      <Title content="Quantity" className="w-[150px] text-center" />
      <Title content="Price" className="w-[150px] text-center" />
      <Title content="Total" className="w-[150px] text-center" />
      <span className="w-[50px]"></span> {/* this is place for delete button */}
    </div>
  );
};

const SummaryItem = ({
  title,
  quantity,
  total,
  currencyChar,
}: {
  title: string;
  quantity?: number;
  total: number;
  currencyChar: string;
}) => {
  return (
    <div className="flex flex-row items-center justify-between text-nowrap">
      <div className="w-2/3 flex flex-row items-center gap-2">
        {title}
        <X className={cn("inline-block", quantity ? "" : "hidden")} size={16} />
        {quantity}
      </div>
      <span>{currencyChar + total}</span>
    </div>
  );
};

const CartItem = ({
  foodImageUrl,
  foodName,
  foodQuantity,
  foodPrice,
  currencyChar,
  onQuantityChange,
  onDelete,
}: {
  foodImageUrl: string;
  foodName: string;
  foodQuantity: number;
  foodPrice: number;
  currencyChar: string;
  onQuantityChange: (value: number) => void;
  onDelete: () => void;
}) => {
  const cartRef = useRef<HTMLDivElement>(null);
  const addAnimation = () => {
    if (cartRef.current) {
      cartRef.current.classList.add("animate-row-disappear");
    }
  };
  return (
    <div
      ref={cartRef}
      className={cn(
        "w-full group text-primaryWord rounded-md bg-slate-50 flex flex-row items-center p-2"
      )}
    >
      <div className="w-1/2 flex flex-row items-center justify-self-start text-center font-semibold text-lg">
        <img
          src={foodImageUrl}
          alt="Twinkle Star"
          className="h-20 rounded justify-seft-start"
        />
        <span className="ml-10">{foodName}</span>
      </div>
      <div className="w-[150px] px-2">
        <NumberInput
          value={foodQuantity}
          onDecrease={() =>
            onQuantityChange(foodQuantity <= 0 ? 0 : foodQuantity - 1)
          }
          onIncrease={() => onQuantityChange(foodQuantity + 1)}
          onChange={(e) => onQuantityChange(Number.parseInt(e.target.value))}
        />
      </div>
      <span className="w-[150px] text-center">{currencyChar + foodPrice}</span>
      <span className="w-[150px] text-center">
        {currencyChar + foodPrice * foodQuantity}
      </span>
      <X
        className="w-[50px] text-center opacity-0 text-red-500 group-hover:opacity-100 ease-linear duration-100 cursor-pointer"
        onClick={() => {
          addAnimation();
          setTimeout(() => {
            onDelete();
          }, 200);
        }}
      />
    </div>
  );
};

const PaymenBar = ({
  className,
  selectedTab,
  setSelectedTab,
}: {
  className?: ClassValue;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-center gap-4",
        className
      )}
    >
      <CartTab
        tabNum={1}
        tabName="Shopping Cart"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <ChevronRight className="text-primary" />
      <CartTab
        tabNum={2}
        tabName="Checkout Details"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <ChevronRight className="text-primary" />
      <CartTab
        tabNum={3}
        tabName="Order Complete"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
};

const CartPage = () => {
  const [cartData, setCartData] = useState(fakeCartData);
  let tempSubtotal = 0;
  cartData.forEach((item) => {
    tempSubtotal += item.price * item.quantity;
  });
  const [subtotal, setSubtotal] = useState(tempSubtotal);
  const [selectedTab, setSelectedTab] = useState("Shopping Cart");

  return (
    <div className="w-full font-sans flex flex-row">
      <div className="max-h-screen flex-1 flex-col p-8 text-primaryWord">
        <div className="bg-white flex flex-col gap-8 items-start mb-4">
          <h1 className="text-primary text-3xl font-bold">Your cart</h1>
          <PaymenBar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>

        <CartContent
          contentFor="Shopping Cart"
          selectedTab={selectedTab}
          className="h-3/4 flex flex-col gap-2"
          content={
            <div className="h-full">
              <TitleBar />
              <div className="h-full overflow-y-scroll">
                {cartData.map((item) => {
                  const onQuantityChange = (value: number) => {
                    setCartData(
                      cartData.map((i) =>
                        i.id === item.id ? { ...i, quantity: value } : i
                      )
                    );
                    setSubtotal(
                      subtotal - item.price * item.quantity + item.price * value
                    );
                  };
                  const onDelete = (id: number) => {
                    setCartData(cartData.filter((i) => i.id !== id));
                    setSubtotal(subtotal - item.price * item.quantity);
                  };
                  return (
                    <CartItem
                      key={item.id}
                      foodImageUrl={item.image}
                      foodName={item.name}
                      foodQuantity={item.quantity}
                      foodPrice={item.price}
                      currencyChar={item.currency}
                      onQuantityChange={onQuantityChange}
                      onDelete={() => onDelete(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          }
        />
        <CartContent
          contentFor="Checkout Details"
          selectedTab={selectedTab}
          className="h-3/4 overflow-y-scroll"
          content={
            <div className="h-full px-2">
              <h1 className="text-lg font-semibold">Billing Information</h1>
              <div className="w-full flex flex-col gap-2">
                <Input
                  id="full-name"
                  label="Full name"
                  placeholder="John Doe"
                  labelColor="text-primaryWord"
                  className="text-primaryWord"
                />
                <Input
                  id="address"
                  label="Address"
                  placeholder="25/21 Phan Boi Chau Street, Dong Tan, Di An, Binh Duong"
                  labelColor="text-primaryWord"
                  className="text-primaryWord"
                />
                <Input
                  id="phone-number"
                  label="Phone number"
                  placeholder="091xxxxxxx"
                />
                <Input
                  id="discount"
                  label="Discount code"
                  placeholder="Your discount code here"
                />
                <TextArea
                  id="note"
                  label="Note"
                  placeholder="Your note here"
                  labelColor="text-primaryWord"
                  className="resize-none h-24"
                />
              </div>
            </div>
          }
        />
        <CartContent
          contentFor="Order Complete"
          selectedTab={selectedTab}
          className="h-3/4 overflow-y-scroll"
          content={<div>order complete</div>}
        />
      </div>
      <div className="w-[400px] min-h-screen bg-primary p-8">
        <TabContent
          contentFor="Shopping Cart"
          selectedTab={selectedTab}
          className="h-full"
          content={
            <div className="relative w-full h-full flex flex-col justify-start text-white gap-4">
              <h1 className="text-3xl font-bold">Order Summary</h1>
              <div className="flex flex-col gap-4">
                <SummaryItem
                  title="Subtotal"
                  total={subtotal}
                  currencyChar="$"
                />
                <SummaryItem
                  title="V.A.T"
                  total={subtotal * 0.1}
                  currencyChar="$"
                />
                <Separate classname="h-[1.5px]" />
                <SummaryItem
                  title="Total"
                  total={subtotal + subtotal * 0.1}
                  currencyChar="$"
                />
              </div>
              <TextButton
                content="Make payment"
                className="absolute bottom-0 bg-[#12192c] hover:bg-[#12192c]/90"
                onClick={() => setSelectedTab("Checkout Details")}
              />
            </div>
          }
        />
        <TabContent
          contentFor="Checkout Details"
          selectedTab={selectedTab}
          className="h-full"
          content={
            <div className="relative w-full h-full flex flex-col justify-start text-white gap-4">
              <h1 className="text-3xl font-bold">Order Summary</h1>
              <div className="w-full h-3/5 max-h-3/5 flex flex-col gap-4 overflow-y-scroll">
                {cartData.sort().map((item) => {
                  return (
                    <SummaryItem
                      key={item.id}
                      title={item.name}
                      total={item.price * item.quantity}
                      quantity={item.quantity}
                      currencyChar={item.currency}
                    />
                  );
                })}
              </div>
              <div className="flex flex-col gap-4">
                <Separate classname="h-[1.5px]" />
                <SummaryItem
                  title="Subtotal"
                  total={subtotal}
                  currencyChar="$"
                />
                <SummaryItem
                  title="V.A.T"
                  total={subtotal * 0.1}
                  currencyChar="$"
                />
                <Separate classname="h-[1.5px]" />
                <SummaryItem
                  title="Total"
                  total={subtotal + subtotal * 0.1}
                  currencyChar="$"
                />
              </div>
              <TextButton
                content="Order"
                className="absolute bottom-0 bg-[#12192c] hover:bg-[#12192c]/90"
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CartPage;
