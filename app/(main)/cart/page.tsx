"use client";
import { IconButton, TextButton } from "@/components/buttons";
import { Input, NumberInput, TextArea } from "@/components/input";
import { Separate } from "@/components/separate";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, CircleCheck, Pen, X } from "lucide-react";
import { fakeCartData } from "../../../fakedata/cartData";
import { CartContent, CartTab } from "./cart_tab";
import { TabContent } from "@/components/tab";
import { useRouter } from "next/navigation";
import { CookieValueTypes, getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { showDefaultToast } from "@/components/toast";
import { Checkbox } from "@nextui-org/react";
import { Food } from "@/models/Food";
import { Cart } from "@/models/Cart";
import { fakeFoodItems } from "@/fakedata/foodData";
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

const TitleBar = ({
  className,
  cartData,
  selectedItems,
  setSelectedItems,
}: {
  className?: ClassValue;
  cartData: Cart[];
  selectedItems: number[];
  setSelectedItems: (selectedItems: number[]) => void;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-end p-2",
        className
      )}
    >
      <Checkbox
        className="mr-2"
        isSelected={selectedItems.length === cartData.length}
        onClick={() => {
          if (selectedItems.length === cartData.length) setSelectedItems([]);
          else setSelectedItems(cartData.map((item) => item.id));
        }}
      />
      <Title content="Food" className="w-1/2 flex" />
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
      <span>{total.toFixed(2) + currencyChar}</span>
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
  isSelected = false,
  onSelected,
}: {
  foodImageUrl: string;
  foodName: string;
  foodQuantity: number;
  foodPrice: number;
  currencyChar: string;
  onQuantityChange: (value: number) => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelected?: () => void;
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
      <Checkbox isSelected={isSelected} className="mr-2" onClick={onSelected} />
      <div className="w-1/2 flex flex-row items-center justify-self-start text-center font-semibold text-lg">
        <img
          src={foodImageUrl}
          alt="Twinkle Star"
          className="h-20 w-40 rounded justify-seft-start object-cover"
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
        {currencyChar + (foodPrice * foodQuantity).toFixed(2)}
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

const getCookieCartData = () => {
  const cookieRes = getCookie("cartData");
  if (!cookieRes) return null;
  return JSON.parse(cookieRes as string) as Cart[];
};

const getCookieSelectedCardIds = () => {
  const cookieRes = getCookie("selectedCardIds");
  if (!cookieRes) return null;
  return (JSON.parse(cookieRes as string) as string)
    .split(",")
    .map((strNum) => Number.parseInt(strNum));
};

const CartPage = () => {
  const router = useRouter();
  const [cartData, setCartData] = useState<Cart[]>(
    getCookieCartData() || fakeCartData
  );
  const [foodData, setFoodData] = useState<Food[]>(fakeFoodItems);
  const [selectedCardIds, setSelectedCartIds] = useState<number[]>(
    getCookieSelectedCardIds() || []
  );
  const handleSelectedCardIdsChange = (id: number) => {
    if (selectedCardIds.includes(id)) {
      setSelectedCartIds(selectedCardIds.filter((i) => i !== id));
    } else {
      setSelectedCartIds([...selectedCardIds, id]);
    }
  };
  const [subtotal, setSubtotal] = useState(0);
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

  useEffect(() => {
    let tempSubtotal = 0;
    const selectedCarts = cartData.filter((cart) =>
      selectedCardIds.includes(cart.id)
    );
    if (selectedCarts.length === 0) {
      setSubtotal(0);
      return;
    }
    selectedCarts.forEach((cart) => {
      const food = foodData.find((food) => food.id === cart.foodId);
      if (!food) return;
      const foodSize = food.foodSizes.find(
        (size) => size.id === cart.foodSizeId
      );
      if (!foodSize) return;
      tempSubtotal += foodSize.price * cart.quantity;
    });
    setSubtotal(tempSubtotal);
    setCookie("selectedCardIds", JSON.stringify(selectedCardIds.join(",")));
    setCookie("cartData", JSON.stringify(cartData));
  }, [selectedCardIds, cartData, foodData]);

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
              <TitleBar
                className={cartData.length > 0 ? "" : "hidden"}
                cartData={cartData}
                selectedItems={selectedCardIds}
                setSelectedItems={setSelectedCartIds}
              />
              <div
                className={cn(
                  "h-full overflow-y-scroll flex flex-col items-center gap-2",
                  cartData.length > 0 ? "" : "hidden"
                )}
              >
                {cartData.map((cart) => {
                  const onQuantityChange = (value: number) => {
                    setCartData(
                      cartData.map((i) =>
                        i.id === cart.id ? { ...i, quantity: value } : i
                      )
                    );
                  };
                  const onDelete = (id: number) => {
                    setCartData(cartData.filter((i) => i.id !== id));
                  };
                  const food = foodData.find((food) => food.id === cart.foodId);
                  if (!food) return null;
                  const foodSize = food.foodSizes.find(
                    (size) => size.id === cart.foodSizeId
                  );
                  if (!foodSize) return null;
                  return (
                    <CartItem
                      key={cart.id}
                      foodImageUrl={food.images[0]}
                      foodName={food.name}
                      foodQuantity={cart.quantity}
                      foodPrice={foodSize.price}
                      currencyChar="đ"
                      onQuantityChange={onQuantityChange}
                      onDelete={() => onDelete(cart.id)}
                      isSelected={selectedCardIds.includes(cart.id)}
                      onSelected={() => handleSelectedCardIdsChange(cart.id)}
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
                {cartData
                  .filter((cart) => selectedCardIds.includes(cart.id))
                  .sort()
                  .map((cart) => {
                    const food = foodData.find(
                      (food) => food.id === cart.foodId
                    );
                    if (!food) return null;
                    const foodSize = food.foodSizes.find(
                      (size) => size.id === cart.foodSizeId
                    );
                    if (!foodSize) return null;
                    return (
                      <SummaryItem
                        key={cart.id}
                        title={food.name}
                        total={foodSize.price * cart.quantity}
                        quantity={cart.quantity}
                        currencyChar="đ"
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
