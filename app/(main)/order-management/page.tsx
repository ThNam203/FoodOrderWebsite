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

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const data: Order[] = useAppSelector((state) => state.order.orders);
  const [rowUpdating, setRowUpdating] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>(data);
  const filterOptionKeys = Object.keys(orderColumnTitles)
    .filter((key) => key !== "images")
    .map((key) => key);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await OrderService.GetAllOrders()
        .then((res) => {
          console.log(res);
          const data = res.data.map((order: any) => OrderToReceive(order));
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
        columns={orderTableColumns(rowUpdating, onStatusChange)}
        columnTitles={orderColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return <OrderDetailTab row={row} setShowTabs={setShowTabs} />;
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
              { value: OrderStatus.REJECTED, borderColor: "border-red-400" },
              {
                value: OrderStatus.CANCELLED,
                borderColor: "border-orange-400",
              },
            ],
          },
        }}
      />
    </div>
  );
}

const OrderDetailTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Order>;
  setShowTabs: (value: boolean) => any;
}) => {
  const order = row.original;
  const [selectFoodItemTab, setSelectFoodItemTab] = useState<number>(-1); //use food name as tab name
  const [selectedFood, setSelectedFood] = useState<Food | undefined>();
  const [selectedCart, setSelectedCart] = useState<Cart | undefined>();

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
  return (
    <div className="flex h-fit flex-col gap-4 px-4 py-2">
      <div className="flex flex-row">
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <RowInfo label="Order ID:" value={order.id.toString()} />
            <RowInfo label="Customer:" value={order.user.name} />
            <RowInfo label="Contact:" value={order.user.phoneNumber} />
            <RowInfo label="Email:" value={order.user.email} />
            <RowInfo label="Address:" value={order.user.address} />
          </div>
          <div className="flex flex-1 flex-col">
            <RowInfo label="Total:" value={order.total.toString() + "đ"} />
            <RowInfo
              label="Order date:"
              value={formatDate(order.createdAt, "datetime")}
            />
            <RowInfo label="Payment method:" value={order.paymentMethod} />
            <RowInfo label="Status:" value={order.status} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row gap-2 items-center">
            <TextButton
              className={cn(
                "text-sm rounded-md py-1",
                selectFoodItemTab === -1
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-100 text-secondaryWord hover:text-primaryWord"
              )}
              onClick={() => handleSelectedFoodItemTabChange(-1)}
            >
              Food items
            </TextButton>
            <ChevronRight className="w-5 h-5 text-secondaryWord" />
          </div>
          <div className="flex flex-row gap-4">
            {order.items.map((cart) => (
              <FoodItemTab
                key={cart.food.id}
                cart={cart}
                selectedTab={selectFoodItemTab}
                setSelectedTab={handleSelectedFoodItemTabChange}
              />
            ))}
          </div>
        </div>
        <FoodItemContent food={selectedFood} cart={selectedCart} />
      </div>
    </div>
  );
};

const RowInfo = ({
  label,
  value,
  showTextArea = false,
}: {
  label: string;
  value: string;
  showTextArea?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mb-2 text-md",
        showTextArea ? "" : "flex flex-row border-b"
      )}
    >
      <p className="w-[150px] font-semibold">{label}</p>
      {showTextArea ? (
        <textarea
          readOnly
          disabled
          className={cn("h-[80px] w-full resize-none border-2 p-1")}
          defaultValue={value}
        ></textarea>
      ) : (
        <p className="max-w-[300px] whitespace-nowrap text-ellipsis">{value}</p>
      )}
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
}: {
  className?: ClassValue;
  cart: Cart;
  selectedTab: number;
  setSelectedTab: (id: number) => void;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const selectedStyle = "bg-primary text-white";
  const defaultStyle =
    "bg-gray-100 hover:bg-gray-100 text-secondaryWord hover:text-primaryWord";
  return (
    <TextButton
      className={cn(
        "text-sm rounded-md py-1",
        selectedTab === cart.food.id ? selectedStyle : defaultStyle
      )}
      onClick={() => {
        setSelectedTab(cart.food.id);
        if (onClick) onClick();
      }}
    >
      {cart.food.name + " x " + cart.quantity.toString()}
    </TextButton>
  );
};

const FoodItemContent = ({
  food,
  cart,
}: {
  food: Food | undefined;
  cart: Cart | undefined;
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
          className={cn("w-[250px] max-h-[200px] rounded-sm overflow-hidden")}
        >
          <CustomCarousel carouselItems={carouselItems} />
        </div>
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <RowInfo label="Food ID:" value={food.id.toString()} />
            <RowInfo label="Food name:" value={food.name} />
            <RowInfo label="Size:" value={cart.foodSize.name} />
            <RowInfo label="Price:" value={displayNumber(cart.price, "đ")} />
          </div>
          <div className="flex flex-1 flex-col">
            <RowInfo label="Note:" value={cart.note} showTextArea />
          </div>
        </div>
      </div>
    </div>
  );
};
