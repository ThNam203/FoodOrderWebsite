"use client";
import { IconButton, TextButton } from "@/components/buttons";
import { Input, NumberInput, TextArea } from "@/components/input";
import { Separate } from "@/components/separate";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, CircleCheck, Pen, X } from "lucide-react";
import { fakeCartData } from "./fakedata";
import { CartContent, CartTab } from "./cart_tab";
import { TabContent } from "@/components/tab";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { showDefaultToast } from "@/components/toast";
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

const TitleBar = ({ className }: { className?: ClassValue }) => {
  return (
    <div className={cn("w-full flex flex-row items-center p-2", className)}>
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

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <Image
        width={200}
        height={200}
        src="/images/empty_cart_item.svg"
        alt="empty cart item image"
      />
      <span className="text-secondaryWord text-xl">Your cart is now empty</span>
    </div>
  );
};

const CartPage = () => {
  const router = useRouter();
  const [cartData, setCartData] = useState<
    {
      id: number;
      image: string;
      name: string;
      price: number;
      quantity: number;
      currency: string;
    }[]
  >([]);
  let tempSubtotal = 0;
  cartData.forEach((item) => {
    tempSubtotal += item.price * item.quantity;
  });
  const [subtotal, setSubtotal] = useState(tempSubtotal);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState(
    getCookie("redirect") === "/cart" ? "Checkout Details" : "Shopping Cart"
  );
  setCookie("redirect", "");

  const handleSelectedTabChange = (nextTab: string) => {
    if (nextTab === selectedTab) return;
    if (cartData.length === 0 && nextTab === "Order Complete") {
      showDefaultToast("Your cart is empty");
      return;
    }
    if (nextTab === "Order Complete") {
      collapseRightColumn();
    }
    if (selectedTab === "Order Complete") {
      appearRightColumn();
    }
    setSelectedTab(nextTab);
  };

  const collapseRightColumn = () => {
    if (rightColRef.current) {
      rightColRef.current.classList.remove("w-[400px]");
      rightColRef.current.classList.add("w-0");
      rightColRef.current.classList.remove("p-8");
    }
  };
  const appearRightColumn = () => {
    if (rightColRef.current) {
      rightColRef.current.classList.remove("w-0");
      rightColRef.current.classList.add("w-[400px]");
      rightColRef.current.classList.add("p-8");
    }
  };

  return (
    <div className="w-full font-sans flex flex-row">
      <div className="max-h-screen flex-1 flex-col p-8 text-primaryWord">
        <div className="bg-white flex flex-col gap-8 items-start mb-4">
          <h1 className="text-primary text-3xl font-bold">Your cart</h1>
          <PaymenBar
            selectedTab={selectedTab}
            setSelectedTab={handleSelectedTabChange}
          />
        </div>

        <CartContent
          contentFor="Shopping Cart"
          selectedTab={selectedTab}
          className="h-3/4 flex flex-col gap-2"
          content={
            <div className={cn("h-full")}>
              {cartData.length === 0 && <EmptyCart />}
              <TitleBar className={cartData.length > 0 ? "" : "hidden"} />
              <div
                className={cn(
                  "h-full overflow-y-scroll",
                  cartData.length > 0 ? "" : "hidden"
                )}
              >
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
          className="h-3/4"
          content={
            <div className="h-full px-2 flex flex-col gap-8">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-row items-center justify-between">
                  <span className="text-lg font-semibold">
                    Your profile information
                  </span>
                  <IconButton
                    icon={<Pen className="w-4 h-4" strokeWidth={2} />}
                    className="bg-gray-50 shadow-primaryShadow text-primary hover:bg-primary hover:text-white ease-linear duration-100"
                    onClick={() => {
                      setCookie("redirect", "/cart");
                      router.push("/user-setting");
                    }}
                  />
                </div>
                <Separate classname="h-[1.5px]" />

                <div className="w-full flex flex-col gap-2">
                  <Input
                    id="full-name"
                    label="Full name"
                    placeholder="John Doe"
                    labelColor="text-secondaryWord"
                    className="text-primaryWord"
                    disabled
                  />
                  <Input
                    id="address"
                    label="Address"
                    placeholder="25/21 Phan Boi Chau Street, Dong Tan, Di An, Binh Duong"
                    labelColor="text-secondaryWord"
                    className="text-primaryWord"
                    disabled
                  />
                  <Input
                    id="phone-number"
                    label="Phone number"
                    placeholder="091xxxxxxx"
                    labelColor="text-secondaryWord"
                    disabled
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h1 className="text-lg font-semibold">More</h1>
                <Separate classname="h-[1.5px]" />
                <Input
                  id="discount"
                  label="Discount code"
                  placeholder="Your discount code here"
                  labelColor="text-primaryWord"
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
          content={
            <div className="flex flex-col items-center gap-4 mt-10">
              <CircleCheck className="w-20 h-20 text-primary" strokeWidth={1} />
              <span className="font-bold text-3xl">
                Thank you for your ordering!
              </span>
              <span>
                Your order has been placed successfully.{" "}
                <a
                  href=""
                  className="hover:underline text-primary text-sm underline-offset-2 underline-primary"
                >
                  Download your bill here.
                </a>
              </span>

              <div className="w-1/2 flex flex-row items-center justify-between gap-4 mt-8">
                <TextButton
                  content="View order"
                  className="bg-gray-50 text-secondaryWord hover:bg-gray-100 hover:text-primaryWord"
                  onClick={() => router.push("/")}
                />
                <TextButton
                  content="Continue shopping"
                  className="text-nowrap"
                  onClick={() => router.push("/browse")}
                />
              </div>
            </div>
          }
        />
      </div>
      <div
        ref={rightColRef}
        className="w-[400px] min-h-screen bg-primary p-8 ease-linear duration-200"
      >
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
                onClick={() => handleSelectedTabChange("Checkout Details")}
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
                onClick={() => handleSelectedTabChange("Order Complete")}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CartPage;
