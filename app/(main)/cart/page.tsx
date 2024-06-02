"use client";
import { IconButton, PayMethodButton, TextButton } from "@/components/buttons";
import { LoadingIcon } from "@/components/icons";
import { Input, NumberInput, TextArea } from "@/components/input";
import { Separate } from "@/components/separate";
import { TabContent } from "@/components/tab";
import { showDefaultToast, showErrorToast } from "@/components/toast";
import { CartToReceive } from "@/convertor/cartConvertor";
import { Cart } from "@/models/Cart";
import { Food } from "@/models/Food";
import { OrderStatus, PaymentMethod } from "@/models/Order";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteCartItem,
  setCartItems,
  updateCartItem,
} from "@/redux/slices/cart";
import { setFoods } from "@/redux/slices/food";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import CartService from "@/services/cartService";
import FoodService from "@/services/foodService";
import OrderService from "@/services/orderService";
import { cn } from "@/utils/cn";
import { displayNumber, isValidInfomation } from "@/utils/func";
import { Checkbox, Radio, RadioGroup, Tooltip } from "@nextui-org/react";
import { ClassValue } from "clsx";
import { getCookie, setCookie } from "cookies-next";
import {
  ChevronRight,
  CircleCheck,
  Edit,
  FileText,
  Pen,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartContent, CartTab } from "./cart_tab";
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
  const activeCarts = cartData.filter((cart) => !cart.foodSize.deleted);

  return (
    <div
      className={cn(
        "w-full h-10 flex flex-row items-center justify-end py-2 pl-2 pr-4",
        className
      )}
    >
      <Checkbox
        className="mr-2"
        isSelected={
          selectedItems.length === activeCarts.length && activeCarts.length > 0
        }
        onClick={() => {
          if (selectedItems.length === activeCarts.length) setSelectedItems([]);
          else setSelectedItems(activeCarts.map((item) => item.id));
        }}
      />
      <Title content="Food" className="flex-1 flex justify-start" />
      <Title content="Size" className="w-[100px] text-center max-lg:hidden" />
      <Title content="Quantity" className="w-[150px] text-center px-8" />
      <Title content="Price" className="w-[100px] text-center max-lg:hidden" />
      <Title content="Total" className="w-[100px] text-center" />
      <Title content="temp" className="w-[100px] opacity-0" />
    </div>
  );
};

const SummaryItem = ({
  title,
  quantity,
  total,
}: {
  title: string;
  quantity?: number;
  total: number;
}) => {
  return (
    <div className="flex flex-row items-center justify-between text-nowrap">
      <div className="w-2/3 flex flex-row items-center gap-2">
        {title}
        <X className={cn("inline-block", quantity ? "" : "hidden")} size={16} />
        {quantity}
      </div>
      <span>{total.toFixed(0) + "$"}</span>
    </div>
  );
};

const CartItem = ({
  foodImageUrl,
  foodName,
  foodQuantity,
  foodPrice,
  size,
  cartNote,
  onQuantityChange,
  onNoteChange,
  onDelete,
  isSelected = false,
  onSelected,
  isOutOfStock = false,
}: {
  foodImageUrl: string;
  foodName: string;
  foodQuantity: number;
  size: string;
  foodPrice: number;
  cartNote: string;
  onQuantityChange: (value: number) => void;
  onNoteChange?: (value: string) => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelected?: () => void;
  isOutOfStock?: boolean;
}) => {
  const cartRef = useRef<HTMLDivElement>(null);
  const addAnimation = () => {
    if (cartRef.current) {
      cartRef.current.classList.add("animate-row-disappear");
    }
  };
  const [isEdittingNote, setIsEdittingNote] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tempCartNote, setTempCartNote] = useState(cartNote);

  return (
    <div
      ref={cartRef}
      className={cn(
        "w-full group text-primaryWord rounded-md bg-slate-50 flex flex-row items-center justify-end p-2",
        isOutOfStock ? "" : "cursor-pointer"
      )}
      onClick={() => {
        if (isOutOfStock) return;
        if (onSelected) onSelected();
      }}
    >
      <Checkbox
        isSelected={isSelected}
        isDisabled={isOutOfStock}
        className="mr-2"
        onClick={onSelected}
      />
      <div className="flex-1 flex md:flex-row max-md:flex-col md:items-center md:gap-4 max-md:items-start text-center font-semibold text-lg">
        <img
          src={foodImageUrl}
          alt="food image"
          className="h-20 rounded justify-seft-start object-cover"
        />
        <div className="w-full flex flex-col items-end justify-start">
          <p className="w-full text-start truncate">{foodName}</p>
          <span
            className={cn(
              "w-full text-red-500 text-start text-sm",
              isOutOfStock ? "" : "hidden"
            )}
          >
            Out of stock !
          </span>
        </div>
      </div>
      <span className="w-[100px] text-center max-lg:hidden">{size}</span>
      <div className="w-[150px] px-2">
        <NumberInput
          value={foodQuantity}
          onDecrease={() =>
            onQuantityChange(foodQuantity <= 0 ? 0 : foodQuantity - 1)
          }
          onIncrease={() => onQuantityChange(foodQuantity + 1)}
          onChange={(e) => onQuantityChange(Number.parseInt(e.target.value))}
          disabled={isOutOfStock}
        />
      </div>

      <span className="w-[100px] text-center max-lg:hidden">
        {displayNumber(foodPrice, "$")}
      </span>
      <span className="w-[100px] text-center">
        {displayNumber(foodPrice * foodQuantity, "$")}
      </span>
      {isOutOfStock ? (
        <span className="w-[50px]"></span>
      ) : (
        <Tooltip
          showArrow
          isOpen={isTooltipOpen}
          onOpenChange={(isOpen) => {
            if (!isEdittingNote) setIsTooltipOpen(isOpen);
          }}
          content={
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {isEdittingNote ? (
                <div className="flex flex-row items-center font-sans">
                  <TextArea
                    className="outline-0 rounded-lg resize-none"
                    value={tempCartNote}
                    onChange={(e) => setTempCartNote(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (onNoteChange) onNoteChange(tempCartNote);
                        setIsTooltipOpen(false);
                        setIsEdittingNote(false);
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="px-2">
                  {cartNote && cartNote.length > 0 ? cartNote : "Add note"}
                </span>
              )}
            </div>
          }
          closeDelay={0}
          classNames={{
            base: [
              // arrow color
              "before:bg-cyan-500 focus-within:before:bg-cyan-500",
            ],
            // tooltip color
            content: [
              "bg-cyan-500 text-white font-sans px-1 focus-within:bg-cyan-500",
            ],
          }}
        >
          <span
            className={cn(
              "w-[50px] flex items-center justify-center opacity-0 text-primaryWord group-hover:opacity-100 ease-linear duration-100 cursor-pointer",
              isEdittingNote ? "opacity-100" : "",
              cartNote && cartNote.length > 0 ? "opacity-100" : ""
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipOpen(!isTooltipOpen);
              setIsEdittingNote(!isEdittingNote);
            }}
          >
            {cartNote && cartNote.length > 0 ? (
              <FileText className="text-cyan-500" />
            ) : (
              <Edit />
            )}
          </span>
        </Tooltip>
      )}

      <X
        className={cn(
          "w-[50px] text-center opacity-0 text-red-500 group-hover:opacity-100 ease-linear duration-100 cursor-pointer",
          isEdittingNote ? "opacity-100" : ""
        )}
        onClick={() => {
          setTimeout(() => onDelete(), 200);
          addAnimation();
        }}
      />
    </div>
  );
};

const PaymentBar = ({
  className,
  selectedTab,
  setSelectedTab,
  hasCompletedOrder = false,
}: {
  className?: ClassValue;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
  hasCompletedOrder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row flex-wrap items-center justify-center gap-4",
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
        disabled={!hasCompletedOrder}
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cartData, setCartData] = useState<Cart[]>([]);
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [selectedCardIds, setSelectedCartIds] = useState<number[]>([]);
  const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [subtotal, setSubtotal] = useState(0);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState(
    getCookie("redirect") === "/cart" ? "Checkout Details" : "Shopping Cart"
  );
  const [isOrdering, setIsOrdering] = useState(false);
  const [hasCompletedOrder, setHasCompletedOrder] = useState(false);
  const thisUser = useAppSelector((state) => state.profile.value);

  const handleSelectedCardIdsChange = (id: number) => {
    if (selectedCardIds.includes(id)) {
      setSelectedCartIds(selectedCardIds.filter((i) => i !== id));
    } else {
      setSelectedCartIds([...selectedCardIds, id]);
    }
  };
  const handlePayMethodChange = (method: PaymentMethod) => {
    if (selectedPayMethod === method) return;
    else setSelectedPayMethod(method);
  };
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
    const fetchData = async () => {
      // dispatch(showPreloader());
      await CartService.GetCart()
        .then((res) => {
          const convertedData = res.data.map((cart: any) =>
            CartToReceive(cart)
          );
          setCartData(convertedData);
          dispatch(setCartItems(convertedData));
        })
        .catch((err) => {});
      await FoodService.getAllFood()
        .then((res) => {
          setFoodData(res.data);
          dispatch(setFoods(res.data));
        })
        .catch((err) => {});
    };
    fetchData().finally(() => {
      // dispatch(disablePreloader());
    });
    setCookie("redirect", "");
  }, []);

  //use to calculate subtotal
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
      const food = foodData.find((food) => food.id === cart.food.id);
      if (!food) return;
      const foodSize = food.foodSizes.find(
        (size) => size.id === cart.foodSize.id
      );
      if (!foodSize) return;
      tempSubtotal += foodSize.price * cart.quantity;
    });
    setSubtotal(tempSubtotal);
  }, [selectedCardIds, cartData, foodData]);

  return (
    <div className="w-full h-screen font-sans flex xl:flex-row xl:justify-between max-xl:flex-col max-xl:overflow-y-scroll">
      <div className="w-full lg:min-h-screen max-lg:h-fit flex flex-col p-8 text-primaryWord">
        <div className="bg-white flex flex-col gap-8 items-start mb-4">
          <h1 className="text-primary text-3xl font-bold">Your cart</h1>
          <PaymentBar
            selectedTab={selectedTab}
            setSelectedTab={handleSelectedTabChange}
            hasCompletedOrder={hasCompletedOrder}
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
                  "h-full flex flex-col items-center gap-2 overflow-y-scroll",
                  cartData.length === 0 ? "hidden" : ""
                )}
              >
                {cartData.map((cart) => {
                  const handleQuantityChange = (value: number) => {
                    setCartData(
                      cartData.map((i) =>
                        i.id === cart.id ? { ...i, quantity: value } : i
                      )
                    );
                  };
                  const handleNoteChange = async (note: string) => {
                    const updatedCart = { ...cart, note: note };
                    await CartService.UpdateCart(updatedCart)
                      .then(() => {
                        dispatch(updateCartItem(updatedCart));
                        setCartData(
                          cartData.map((cart) =>
                            cart.id === updatedCart.id ? updatedCart : cart
                          )
                        );
                      })
                      .catch((err) => {
                        showErrorToast(
                          "Failed to update cart item with error:" + err
                        );
                      });
                  };
                  const onDelete = async (id: number) => {
                    await CartService.DeleteCart(id)
                      .then(() => {
                        dispatch(deleteCartItem(id));
                        setCartData(cartData.filter((i) => i.id !== id));
                        setSelectedCartIds(
                          selectedCardIds.filter((i) => i !== id)
                        );
                      })
                      .catch((err) => {
                        showErrorToast(
                          "Failed to delete cart item with error:" + err
                        );
                      });
                  };
                  const food = foodData.find(
                    (food) => food.id === cart.food.id
                  );
                  if (!food) return null;

                  return (
                    <CartItem
                      key={cart.id}
                      foodImageUrl={food.images[0]}
                      foodName={food.name}
                      foodQuantity={cart.foodSize.deleted ? 0 : cart.quantity}
                      foodPrice={cart.foodSize.price}
                      size={cart.foodSize.name}
                      cartNote={cart.note}
                      isOutOfStock={cart.foodSize.deleted}
                      onQuantityChange={handleQuantityChange}
                      onNoteChange={handleNoteChange}
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
          className="h-fit"
          content={
            <div className="h-fit px-2 flex flex-col gap-8">
              <div className="w-full flex flex-col gap-2">
                <IconButton
                  icon={<Pen className="w-4 h-4" strokeWidth={2} />}
                  className="self-end bg-gray-50 shadow-primaryShadow text-primary hover:bg-primary hover:text-white ease-linear duration-100"
                  onClick={() => {
                    setCookie("redirect", "/cart");
                    router.push("/user-setting");
                  }}
                />
                <Separate classname="h-[1.5px]" />
                <Input
                  id="full-name"
                  label="Full name"
                  placeholder={thisUser ? thisUser.name : ""}
                  labelColor="text-secondaryWord"
                  className="text-primaryWord"
                  onClick={() => {
                    console.log("click", thisUser);
                  }}
                  disabled
                />
                <Input
                  id="address"
                  label="Address"
                  placeholder={thisUser ? thisUser.address : ""}
                  labelColor="text-secondaryWord"
                  className="text-primaryWord"
                  disabled
                />
                <Input
                  id="phone-number"
                  label="Phone number"
                  placeholder={thisUser ? thisUser.phoneNumber : ""}
                  labelColor="text-secondaryWord"
                  disabled
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Separate classname="h-[1.5px]" />

                <TextArea
                  id="note"
                  label="Note"
                  placeholder="Your note here"
                  labelColor="text-primaryWord"
                  className="resize-none h-24"
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Separate classname="h-[1.5px]" />
                <div className="font-bold">Payment method</div>
                <div className="w-full flex flex-row flex-wrap items-center justify-start gap-2">
                  <PayMethodButton
                    content={PaymentMethod.CASH}
                    icon={
                      <Image
                        src="/images/pay_by_cash.png"
                        alt="momo"
                        className="rounded-lg"
                        width={40}
                        height={40}
                      />
                    }
                    selectedButton={selectedPayMethod}
                    onClick={() => handlePayMethodChange(PaymentMethod.CASH)}
                  />
                  <PayMethodButton
                    content={PaymentMethod.MOMO}
                    icon={
                      <Image
                        src="/images/momo_logo.svg"
                        alt="momo"
                        className="rounded-lg"
                        width={40}
                        height={40}
                      />
                    }
                    selectedButton={selectedPayMethod}
                    onClick={() => handlePayMethodChange(PaymentMethod.MOMO)}
                  />
                </div>
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
              <span className="font-bold text-3xl text-center">
                Thank you for your ordering!
              </span>
              <span className="text-center">
                Your order has been placed successfully.{" "}
                <a
                  href=""
                  className="hover:underline text-primary text-sm underline-offset-2 underline-primary"
                >
                  Download your bill here.
                </a>
              </span>

              <div className="md:w-1/2 max-md:w-full flex flex-row items-center justify-between gap-4 mt-8">
                <TextButton
                  className="w-1/2 bg-gray-50 text-secondaryWord hover:bg-gray-100 hover:text-primaryWord whitespace-nowrap"
                  onClick={() => router.push("/history")}
                >
                  View order
                </TextButton>
                <TextButton
                  className="w-1/2 whitespace-nowrap"
                  onClick={() => router.push("/")}
                >
                  Continue shopping
                </TextButton>
              </div>
            </div>
          }
        />
      </div>
      <div
        ref={rightColRef}
        className={cn(
          "w-[400px] max-xl:w-full min-h-screen bg-primary p-8 ease-linear duration-200 max-lg:hidden"
        )}
      >
        <TabContent
          contentFor="Shopping Cart"
          selectedTab={selectedTab}
          className="h-full"
          content={
            <div className="relative w-full h-full flex flex-col justify-start text-white gap-4">
              <h1 className="text-3xl font-bold whitespace-nowrap">
                Order Summary
              </h1>
              <div className="flex flex-col gap-4">
                <SummaryItem title="Subtotal" total={subtotal} />
                <SummaryItem title="V.A.T" total={0} />
                <Separate classname="h-[1.5px]" />
                <SummaryItem title="Total" total={subtotal} />
              </div>
              <TextButton
                className="absolute bottom-0 w-full bg-third hover:bg-third/90"
                onClick={() => {
                  handleSelectedTabChange("Checkout Details");
                }}
              >
                Make payment
              </TextButton>
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
                    if (cart.quantity === 0) return null;
                    const food = foodData.find(
                      (food) => food.id === cart.food.id
                    );
                    if (!food) return null;
                    const foodSize = food.foodSizes.find(
                      (size) => size.id === cart.foodSize.id
                    );
                    if (!foodSize) return null;
                    return (
                      <SummaryItem
                        key={cart.id}
                        title={food.name}
                        total={foodSize.price * cart.quantity}
                        quantity={cart.quantity}
                      />
                    );
                  })}
              </div>
              <div className="flex flex-col gap-4">
                <Separate classname="h-[1.5px]" />
                <SummaryItem title="Subtotal" total={subtotal} />
                <SummaryItem title="V.A.T" total={0} />
                <Separate classname="h-[1.5px]" />
                <SummaryItem title="Total" total={subtotal} />
              </div>
              <TextButton
                iconBefore={isOrdering ? <LoadingIcon /> : null}
                className="absolute bottom-0 w-full bg-[#12192c] hover:bg-[#12192c]/90"
                onClick={async () => {
                  if (!thisUser) {
                    showDefaultToast("Please login to make order");
                    return;
                  }
                  if (selectedCardIds.length === 0) {
                    showDefaultToast(
                      "Please select at least one item in your cart"
                    );
                    return;
                  }
                  const cartList = cartData.filter((cart) =>
                    selectedCardIds.includes(cart.id)
                  );

                  //detect any item in cart has quantity = 0
                  if (cartList.some((cart) => cart.quantity === 0)) {
                    showDefaultToast(
                      "Please check the quantity of each item in your cart"
                    );
                    return;
                  }
                  if (cartList.some((cart) => cart.foodSize.deleted)) {
                    showDefaultToast("Some cart items are out of stock !");
                    return;
                  }
                  if (
                    !isValidInfomation(thisUser.phoneNumber) ||
                    !isValidInfomation(thisUser.address)
                  ) {
                    showDefaultToast(
                      "Please fill in your address and phone number in your profile"
                    );
                    return;
                  }

                  setIsOrdering(true);
                  // const totalPrice = subtotal + subtotal * 0.1;

                  // await MomoService.MakePayment(
                  //   CreateDataForPayment(totalPrice)
                  // )
                  //   .then((res) => {
                  //     console.log("momo res: ", res);
                  //   })
                  //   .catch((err) => {
                  //     console.log("momo err: ", err);
                  //   });
                  await OrderService.AddOrder(
                    cartList,
                    OrderStatus.PENDING,
                    selectedPayMethod,
                    thisUser
                  )
                    .then(() => {
                      handleSelectedTabChange("Order Complete");
                      setHasCompletedOrder(true);
                      const newCartData = cartData.filter(
                        (cart) => !selectedCardIds.includes(cart.id)
                      );
                      setCartData(newCartData);
                      dispatch(setCartItems(newCartData));
                      setSelectedCartIds([]);
                    })
                    .catch((err) =>
                      showErrorToast("Failed to order with error: " + err)
                    )
                    .finally(() => setIsOrdering(false));
                }}
              >
                {isOrdering ? "" : "Order"}
              </TextButton>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CartPage;
