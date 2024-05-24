"use client";
import { TextButton } from "@/components/buttons";
import { CustomDatatable } from "@/components/datatable/custom_datatable";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

import CustomCarousel, {
  CarouselItem,
} from "@/components/CustomCarousel/image_carousel";
import { showErrorToast } from "@/components/toast";
import { OrderToReceive } from "@/convertor/orderConvertor";
import { Cart } from "@/models/Cart";
import { Order, OrderStatus } from "@/models/Order";
import { setOrders } from "@/redux/slices/order";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import OrderService from "@/services/orderService";
import { cn } from "@/utils/cn";
import { displayNumber, formatDate, handleFilterColumn } from "@/utils/func";
import { Row } from "@tanstack/react-table";
import { ClassValue } from "clsx";
import { ChevronRight } from "lucide-react";
import {
  orderColumnTitles,
  orderDefaultVisibilityState,
  orderTableColumns,
} from "./table_columns";
import { ConfirmDialog, useConfirmDialog } from "@/components/confirm_dialog";
import { RateForm } from "@/components/Rating/rate_form";
import { FoodProperty } from "@/components/food_detail";
import useEmblaCarousel from "embla-carousel-react";

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const data: Order[] = useAppSelector((state) => state.order.orders);
  const thisUser = useAppSelector((state) => state.profile.value);
  const [rowUpdating, setRowUpdating] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>(data);
  const filterOptionKeys = Object.keys(orderColumnTitles)
    .filter((key) => key !== "images")
    .map((key) => key);
  const { isOpen, setOpen } = useConfirmDialog();
  const [orderToRate, setOrderToRate] = useState<Order | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await OrderService.GetAllOrders()
        .then((res) => {
          let data: Order[] = res.data.map((order: any) =>
            OrderToReceive(order)
          );
          data = data.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          dispatch(setOrders(data));
        })
        .catch((err) => {
          showErrorToast(err.message);
        });
      dispatch(disablePreloader());
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  const handleCustomerFilter = (filterInput: string, data: Order[]) => {
    const filteredData = data.filter((order) =>
      order.user.name.toString().includes(filterInput.toString())
    );
    return filteredData;
  };
  const handleContactFilter = (filterInput: string, data: Order[]) => {
    const filteredData = data.filter((order) =>
      order.user.phoneNumber.toString().includes(filterInput.toString())
    );
    return filteredData;
  };
  const handleEmailFilter = (filterInput: string, data: Order[]) => {
    const filteredData = data.filter((order) =>
      order.user.email.toString().includes(filterInput.toString())
    );
    return filteredData;
  };
  const handleAddressFilter = (filterInput: string, data: Order[]) => {
    const filteredData = data.filter((order) =>
      order.user.address.toString().includes(filterInput.toString())
    );
    return filteredData;
  };
  const handleCreatedDateFilter = (filterInput: string, data: Order[]) => {
    const filteredData = data.filter((order) =>
      formatDate(order.createdAt).includes(filterInput.toString())
    );
    return filteredData;
  };
  const handleFilterChange = (filterInput: string, col: string) => {
    console.log(filterInput, col);
    let filteredData: Order[] = [];
    if (col === "") filteredData = getFilterAllTableData(filterInput);
    else filteredData = getDataFilter(filterInput, col);
    setFilteredData(filteredData);
  };
  const getDataFilter = (filterInput: string, col: string) => {
    //special col that cannot filter as default
    if (col === "user") return handleCustomerFilter(filterInput, data);
    else if (col === "contact") return handleContactFilter(filterInput, data);
    else if (col === "email") return handleEmailFilter(filterInput, data);
    else if (col === "address") return handleAddressFilter(filterInput, data);
    else if (col === "createdAt")
      return handleCreatedDateFilter(filterInput, data);
    return handleFilterColumn(filterInput, col, data);
  };
  const getFilterAllTableData = (filterInput: string) => {
    let filteredAllTableData: Set<Order> = new Set();
    Object.keys(orderColumnTitles).forEach((col) => {
      const filteredData = getDataFilter(filterInput, col);
      filteredData.forEach((order) => filteredAllTableData.add(order));
    });
    const filteredData = Array.from(filteredAllTableData);
    return filteredData;
  };

  const [dataStatusChange, setDataStatusChange] = useState<{
    id: number;
    status: OrderStatus;
  }>();
  const handleConfirmBeforeStatusChange = (id: number, status: OrderStatus) => {
    setDataStatusChange({ id, status });
    setOpen(true);
  };
  const handleRateOrder = (food: Order) => {
    setOrderToRate(food);
  };

  const onStatusChange = async (id: number, status: OrderStatus) => {
    setRowUpdating([...rowUpdating, id]);
    await OrderService.UpdateOrder(id, status)
      .then((res) => {
        const updatedOrder = OrderToReceive(res.data);
        const newData = data.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        dispatch(setOrders(newData));
      })
      .catch((err) => {
        showErrorToast(err.message);
      })
      .finally(() => {
        setRowUpdating(rowUpdating.filter((rowId) => rowId !== id));
      });
  };

  return (
    <div className="h-screen flex flex-col p-8 text-primaryWord overflow-y-scroll">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-4xl font-bold text-primary">History</h1>
      </div>
      <CustomDatatable
        data={filteredData}
        columns={orderTableColumns(
          rowUpdating,
          handleConfirmBeforeStatusChange
        )}
        columnTitles={orderColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return (
                <DetailTab
                  row={row}
                  setOrderToRate={handleRateOrder}
                  setShowTabs={setShowTabs}
                />
              );
            },
            tabName: "Order details",
          },
        ]}
        config={{
          defaultVisibilityState: orderDefaultVisibilityState,
          showFilterButton: true,
          filterOptionKeys: filterOptionKeys,
          showDataTableViewOptions: true,
          showRowSelectedCounter: true,
          onFilterChange: handleFilterChange,
          rowColorDependence: {
            key: "status",
            condition: [
              { value: OrderStatus.PENDING, borderColor: "border-yellow-400" },
              { value: OrderStatus.ACCEPTED, borderColor: "border-green-400" },
              { value: OrderStatus.DELIVERED, borderColor: "border-blue-400" },
              {
                value: OrderStatus.CANCELLED,
                borderColor: "border-red-400",
              },
            ],
          },
        }}
      />
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Cancel order"
        content="Are you sure you want to cancel this order ?"
        onAccept={() => {
          setOpen(false);
          if (dataStatusChange)
            onStatusChange(dataStatusChange.id, dataStatusChange.status);
        }}
        onCancel={() => setOpen(false)}
      />
      {orderToRate && (
        <RateForm
          order={orderToRate}
          closeForm={() => setOrderToRate(undefined)}
        />
      )}
    </div>
  );
}

const DetailTab = ({
  row,
  setOrderToRate,
  setShowTabs,
}: {
  row: Row<Order>;
  setOrderToRate: (order: Order) => void;
  setShowTabs: (value: boolean) => any;
}) => {
  const order = row.original;
  const [selectFoodItemTab, setSelectFoodItemTab] = useState<number>(-1);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>();
  const [selectedCart, setSelectedCart] = useState<Cart | undefined>();
  const [emblaRef, emplaApi] = useEmblaCarousel({ loop: false });

  const handleSelectedFoodItemTabChange = (id: number) => {
    setSelectFoodItemTab(id);
    if (id === -1) {
      setSelectedFood(undefined);
      setSelectedCart(undefined);
    } else {
      const cart = order.items.find((cart) => cart.food.id === id);
      if (cart) {
        setSelectedCart(cart);
        setSelectedFood(cart.food);
      }
    }
  };
  useEffect(() => {
    if (order.items.length > 0) {
      setSelectFoodItemTab(order.items[0].food.id);
      setSelectedFood(order.items[0].food);
      setSelectedCart(order.items[0]);
    }
  }, []);
  return (
    <div className="flex h-fit flex-col gap-4 px-4 py-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-1 overflow-hidden" ref={emblaRef}>
            <div className="w-full flex flex-row gap-2 select-none">
              {order.items.map((cart) => (
                <FoodItemTab
                  key={cart.food.id}
                  cart={cart}
                  selectedTab={selectFoodItemTab}
                  setSelectedTab={handleSelectedFoodItemTabChange}
                  orderStatus={order.status}
                />
              ))}
            </div>
          </div>
          {order.status === OrderStatus.DELIVERED && (
            <TextButton
              onClick={() => {
                setOrderToRate(order);
              }}
              disabled={order.feedback ? true : false}
              className="py-1 disabled:opacity-100"
            >
              {order.feedback ? "Rated" : "Rate this order"}
            </TextButton>
          )}
        </div>
        <FoodItemContent food={selectedFood} cart={selectedCart} />
      </div>
    </div>
  );
};

const FoodItemTab = ({
  className,
  cart,
  selectedTab,
  setSelectedTab,
  onClick,
  disabled = false,
  orderStatus,
}: {
  className?: ClassValue;
  cart: Cart;
  selectedTab: number;
  setSelectedTab: (id: number) => void;
  onClick?: () => void;
  disabled?: boolean;
  orderStatus: OrderStatus;
}) => {
  let selectedStyle = "text-white ";
  if (orderStatus === OrderStatus.PENDING) selectedStyle += "bg-yellow-400";
  if (orderStatus === OrderStatus.ACCEPTED) selectedStyle += "bg-green-400";
  if (orderStatus === OrderStatus.CANCELLED) selectedStyle += "bg-red-500";
  if (orderStatus === OrderStatus.DELIVERED) selectedStyle += "bg-blue-500";
  const defaultStyle =
    "flex flex-row items-center bg-gray-100 hover:bg-gray-100 text-secondaryWord hover:text-primaryWord";
  return (
    <TextButton
      className={cn(
        "text-sm rounded-[999px] py-1 space-x-1 whitespace-nowrap",
        selectedTab === cart.food.id ? selectedStyle : defaultStyle
      )}
      onClick={() => {
        setSelectedTab(cart.food.id);
        if (onClick) onClick();
      }}
    >
      <span className="max-w-[100px] truncate">{cart.food.name}</span>
      <span className="text-nowrap">{"x " + cart.quantity.toString()}</span>
    </TextButton>
  );
};

const FoodItemContent = ({
  food,
  cart,
}: {
  food: Food | undefined;
  cart: Cart | undefined;
  onRateFood?: () => void;
}) => {
  if (!food || !cart) return null;

  const carouselItems: CarouselItem[] = food.images.map((image) => {
    return {
      image: image,
    };
  });

  return (
    <div className="flex h-fit flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div
          className={cn(
            "w-[250px] h-[200px] shrink-0 rounded-sm overflow-hidden"
          )}
        >
          <CustomCarousel carouselItems={carouselItems} />
        </div>
        <div className="relative flex-1">
          <div className="w-auto flex flex-col gap-2 justify-start">
            <div className="w-[60vw] text-primaryWord text-2xl font-semibold capitalize truncate">
              {food.name}
            </div>
            <div className="w-[40vw] text-secondaryWord text-lg capitalize truncate">
              {food.description}
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <FoodProperty name={cart.foodSize.name} isSelected={true} />

              <span className="w-fit text-primary text-lg">
                {displayNumber(cart.price, "đ")}
              </span>
            </div>
            <div
              className={cn(
                "w-[50vw] flex flex-row gap-2",
                cart.note && cart.note.length > 0 ? "" : "opacity-0"
              )}
            >
              <span className="text-cyan-500 font-semibold">Note:</span>
              <span className="w-full text-primaryWord line-clamp-3 overflow-hidden text-ellipsis">
                {cart.note}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
